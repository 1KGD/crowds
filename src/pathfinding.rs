use std::cell::*;
use std::i32;
use std::rc::*;
use std::usize;

use crate::util::*;

#[derive(Clone, PartialEq, Eq, PartialOrd, Ord)]
struct Node {
    g: i32,
    rhs: i32,
    pos: TileVec2,
    predecessors: Vec<Rc<RefCell<Node>>>,
    successors: Vec<Rc<RefCell<Node>>>,
}

impl Node {
    pub fn new(pos: TileVec2) -> Self {
        Self {
            g: i32::MAX,
            rhs: i32::MAX,
            pos,
            predecessors: Vec::new(),
            successors: Vec::new(),
        }
    }

    pub fn get_heuristic(&self, goal: TileVec2) -> i32 {
        goal.dist_to(self.pos) as i32
    }

    pub fn get_cost_to(&self, rc: &Rc<RefCell<Node>>) -> i32 {
        self.pos.dist_to(rc.borrow().pos) as i32
    }
}

#[derive(Clone)]
pub struct Pathfinder {
    queue: Vec<Rc<RefCell<Node>>>,
    start: TileVec2,
    goal: TileVec2,
}

impl Pathfinder {
    pub fn new() -> Self {
        let queue: Vec<Rc<RefCell<Node>>> = Vec::new();
        let mut this: Pathfinder = Self {
            queue,
            start: TileVec2(0, 0),
            goal: TileVec2(20, 18),
        };

        let mut start: Node = Node::new(this.start);
        start.rhs = 0;
        this.add_node_to_queue(start);

        this.refresh();

        this
    }

    fn calculate_key(&self, node: &Node) -> usize {
        return (i32::min(node.g, node.rhs) + node.get_heuristic(self.goal)) as usize;
    }

    fn add_rc_to_queue(&mut self, rc: Rc<RefCell<Node>>) {
        let key: usize = self.calculate_key(&rc.borrow());
        self.queue.insert(key, rc);
    }

    fn add_node_to_queue(&mut self, node: Node) {
        self.add_rc_to_queue(Rc::new(RefCell::new(node)));
    }

    fn get_top_key(&self) -> usize {
        usize::MAX
    }

    pub fn refresh(&mut self) {
        let goal_node: Node = Node::new(self.goal);
        while self.get_top_key() < self.calculate_key(&goal_node) || goal_node.rhs != goal_node.g {
            let mut rc: Rc<RefCell<Node>> = self.queue.pop().unwrap();
            let rc_clone: Rc<RefCell<Node>> = Rc::clone(&rc);
            let mut node: RefMut<'_, Node> = rc_clone.borrow_mut();
            if node.g > node.rhs {
                node.g = node.rhs;
            } else {
                node.g = i32::MAX;
                self.update_node(&mut rc);
            }
            node.successors
                .iter()
                .for_each(|successor: &Rc<RefCell<Node>>| {
                    self.update_node(&successor);
                });
        }
    }

    fn update_node(&mut self, rc: &Rc<RefCell<Node>>) {
        let mut node: RefMut<'_, Node> = rc.borrow_mut();
        if node.pos != self.start {
            node.rhs = i32::MAX;
            let mut new_rhs: i32 = node.rhs;
            node.predecessors
                .iter()
                .for_each(|pre: &Rc<RefCell<Node>>| {
                    let predecessor: Ref<'_, Node> = pre.borrow();
                    new_rhs = i32::min(new_rhs, predecessor.g + predecessor.get_cost_to(&rc));
                });
            node.rhs = new_rhs;
            if self.queue.contains(rc) {
                self.queue.remove(
                    self.queue
                        .iter()
                        .position(|n: &Rc<RefCell<Node>>| n.borrow().pos == node.pos)
                        .unwrap(),
                );
            }
            if node.g != node.rhs {
                self.add_rc_to_queue(Rc::clone(&rc));
            }
        }
    }
}
