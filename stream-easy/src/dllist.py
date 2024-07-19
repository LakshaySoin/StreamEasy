class Node:
    def __init__(self, val=None, prev=None, next=None):
        self.val = val
        self.prev = prev
        self.next = next
    
class DLList:
    def __init__(self):
        self.first = Node()
        self.first.next = self.first
        self.first.prev = self.first
        self.size = 0

    def addNode(self, curr, node):
        # add node before curr
        node.prev = curr.prev
        node.next = curr
        curr.prev.next = node
        curr.prev = node
        self.size += 1

    def insert(self, index, val):
        assert (index >= 0 and index <= self.size)
        num = 0
        curr = self.first
        while (num != index):
            curr = curr.next
            num += 1
        node = Node(val)
        self.addNode(curr, node)

    def addLast(self, val):
        node = Node(val)
        self.addNode(self.first, node)
    
    def __iter__(self):
        curr = self.first.next
        while curr != self.first:
            yield curr.val
            curr = curr.next