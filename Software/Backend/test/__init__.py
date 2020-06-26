import unittest

import os

import sys

from factory import BlFactory


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class ConversationTest(unittest.TestCase):

    def test_update(self):
        self.assertEquals(abs(-1), 1)
        BlFactory.stockBl.get_achievement(["000725", "300750"], [100, 200])


if __name__ == '__main__':
    unittest.main()
