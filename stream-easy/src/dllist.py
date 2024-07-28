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
        self.curr = self.first
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

    def getNext(self):
        self.curr = self.curr.next
        if (self.curr == self.first):
            self.curr = self.curr.next
        val = self.curr.val
        return val

    def getPrev(self):
        self.curr = self.curr.prev
        if (self.curr == self.first):
            self.curr = self.curr.prev
        val = self.curr.val
        return val

    def isEmpty(self):
        return self.size == 0

    def clear(self):
        self.first.next = self.first
        self.first.prev = self.first
        self.curr = self.first
        self.size = 0
    
    def __iter__(self):
        temp = self.curr.next
        while temp != self.first:
            yield temp.val
            temp = temp.next