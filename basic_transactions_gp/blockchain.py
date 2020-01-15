import hashlib
import json
from time import time
from uuid import uuid4

from flask import Flask, jsonify, request

# Current difficulty
DIFFICULTY = 4
# 1 coin for difficulty 6, increasing with difficulty
REWARD = DIFFICULTY ** 3 / 216.0


class Blockchain(object):
    def __init__(self):
        self.chain = []
        self.current_transactions = []

        # Create the genesis block
        self.new_block(previous_hash='================', proof=100)

    def new_block(self, proof, previous_hash=None):
        """
        Create a new Block in the Blockchain

        A block should have:
        * Index
        * Timestamp
        * List of current transactions
        * The proof used to mine this block
        * The hash of the previous block

        :param proof: <int> The proof given by the Proof of Work algorithm
        :param previous_hash: (Optional) <str> Hash of previous Block
        :return: <dict> New Block
        """

        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.current_transactions,
            'proof': proof,
            'previous_Hash': previous_hash or self.hash(self.chain[-1])
        }

        # Reset the current list of transactions
        self.current_transactions = []
        # Append the chain to the block
        self.chain.append(block)
        # Return the new block
        return block

    def new_transaction(self, sender, recipient, amount):
        """
        Adds a new transaction to the list of transactions:

        :param sender: <str> Address of the Recipient
        :param recipient: <str> Address of the Recipient
        :param amount: <int> Amount
        :return: <int> The index of the `block` that will hold this transaction
        """

        self.current_transactions.append({
            'sender': sender,
            'recipient': recipient,
            'amount': amount
        })

        return len(self.chain) + 1

    def hash(self, block):
        """
        Creates a SHA-256 hash of a Block

        :param block": <dict> Block
        "return": <str>
        """

        # Use json.dumps to convert json into a string
        # Use hashlib.sha256 to create a hash
        # It requires a `bytes-like` object, which is what
        # .encode() does.
        # It convertes the string to bytes.
        # We must make sure that the Dictionary is Ordered,
        # or we'll have inconsistent hashes

        # Create the block_string
        block_string = json.dumps(block, sort_keys=True).encode()

        # Hash this string using sha256
        hash = hashlib.sha256(block_string).hexdigest()

        # By itself, the sha256 function returns the hash in a raw string
        # that will likely include escaped characters.
        # This can be hard to read, but .hexdigest() converts the
        # hash to a string of hexadecimal characters, which is
        # easier to work with and understand

        # Return the hashed block string in hexadecimal format
        return hash

    @property
    def last_block(self):
        return self.chain[-1]

    def proof_of_work(self, block):
        """
        Simple Proof of Work Algorithm
        Stringify the block and look for a proof.
        Loop through possibilities, checking each one against `valid_proof`
        in an effort to find a number that is a valid proof
        :return: A valid proof for the provided block
        """

        block_string = json.dumps(block, sort_keys=True)
        proof = 0
        while self.valid_proof(block_string, proof) is False:
            proof += 1

        return proof
        # return proof

    @staticmethod
    def valid_proof(block_string, proof):
        """
        Validates the Proof:  Does hash(block_string, proof) contain 3
        leading zeroes?  Return true if the proof is valid
        :param block_string: <string> The stringified block to use to
        check in combination with `proof`
        :param proof: <int?> The value that when combined with the
        stringified previous block results in a hash that has the
        correct number of leading zeroes.
        :return: True if the resulting hash is a valid proof, False otherwise
        """

        guess = f'{block_string}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()

        return guess_hash[:DIFFICULTY] == "0" * DIFFICULTY

        # return True or False


# Instantiate our Node
app = Flask(__name__)
# app.run(debug=True)

# Generate a globally unique address for this node
node_identifier = str(uuid4()).replace('-', '')

# Instantiate the Blockchain
blockchain = Blockchain()


@app.route('/mine', methods=['POST'])
def mine():
    # Extract data from the request body
    data = request.get_json()

    # If proof and id parameters received, validate proof and return success or failure
    if 'proof' in data and 'id' in data:
        success = blockchain.valid_proof(
            json.dumps(blockchain.last_block, sort_keys=True), str(data['proof']))
        if success:
            # Send reward to the submitter of the proof
            blockchain.new_transaction('0', data['id'], REWARD)
            # Forge the new Block by adding it to the chain with the proof
            previous_hash = blockchain.hash(blockchain.last_block)
            new_block = blockchain.new_block(data['proof'], previous_hash)

        response = {
            'success': success,
            'message': 'New Block Forged' if success else 'Proof not accepted',
            'reward': REWARD,
            'block': new_block
        }
        status = 200
    else:
        response = {
            'success': False,
            'message': 'Parameters "proof" and "id" are required'
        }
        status = 400

    # Send a JSON response
    return jsonify(response), status


@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        # Return the chain and its current length
        'length': len(blockchain.chain),
        'chain': blockchain.chain
    }
    return jsonify(response), 200


@app.route('/last_block', methods=['GET'])
def last_block():
    response = {
        # Return the last block mined and current difficulty
        'block': blockchain.chain[len(blockchain.chain) - 1],
        'difficulty': DIFFICULTY
    }
    return jsonify(response), 200


# Run the program on port 5000
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
