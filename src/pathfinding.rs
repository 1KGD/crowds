use std::cell::*;
use std::collections::HashMap;
use std::i32;
use std::rc::*;
use std::usize;

use crate::util::*;
use crate::*;

#[derive(Clone, PartialEq, Eq, PartialOrd, Ord)]
struct Node {
    g: i32,
    rhs: i32,
    pos: TileVec2,
}

type NodeRc = Rc<RefCell<Node>>;

impl Node {
    pub fn new(pos: TileVec2) -> Self {
        Self {
            g: i32::MAX,
            rhs: i32::MAX,
            pos,
        }
    }

    pub fn get_heuristic(&self, goal: TileVec2) -> i32 {
        goal.dist_to(self.pos) as i32
    }

    pub fn get_cost_to(&self, rc: &NodeRc) -> i32 {
        self.pos.dist_to(rc.borrow().pos) as i32
    }

    pub fn adjacent(&self, pathfinder: &mut Pathfinder) -> Vec<NodeRc> {
        [
            TileVec2(-1, 0),
            TileVec2(1, 0),
            TileVec2(0, -1),
            TileVec2(0, 1),
        ]
        .iter()
        .map(|pos: &TileVec2| pathfinder.get_node(*pos + self.pos))
        .collect()
    }
}

pub struct Pathfinder<'a> {
    nodes: HashMap<TileVec2, NodeRc>,
    queue: Vec<NodeRc>,
    start: NodeRc,
    goal: TileVec2,
    world: &'a Game,
}

impl<'a> Pathfinder<'a> {
    pub fn new(world: &'a Game, start: TileVec2, goal: TileVec2) -> Self {
        let queue: Vec<NodeRc> = Vec::new();
        let mut this: Pathfinder = Self {
            nodes: HashMap::new(),
            queue,
            start: Rc::new(RefCell::new(Node::new(start))),
            goal,
            world,
        };

        this.start.borrow_mut().rhs = 0;
        this.add_rc_to_queue(Rc::clone(&this.start));

        this.refresh();

        this
    }

    fn calculate_key(&self, node: &Node) -> usize {
        (i32::min(node.g, node.rhs) + node.get_heuristic(self.goal)) as usize
    }

    fn add_rc_to_queue(&mut self, rc: NodeRc) {
        let key: usize = self.calculate_key(&rc.borrow());
        self.queue.insert(key.clamp(0, self.queue.len()), rc);
    }

    fn get_node(&mut self, pos: TileVec2) -> NodeRc {
        if self.nodes.contains_key(&pos) {
            return Rc::clone(self.nodes.get(&pos).unwrap());
        }
        let node: NodeRc = Rc::new(RefCell::new(Node::new(pos)));
        self.nodes.insert(pos, Rc::clone(&node));
        node
    }

    fn get_top_key(&self) -> usize {
        usize::MAX
    }

    pub fn next_pos(&mut self) -> Option<TileVec2> {
        let start_rc: NodeRc = Rc::clone(&self.start);
        let start: Ref<'_, Node> = start_rc.borrow();
        let successors: Vec<NodeRc> = start.adjacent(self);
        let mut next_node: Ref<'_, Node> = start;
        successors.iter().for_each(|rc: &Rc<RefCell<Node>>| {
            let node: Ref<'_, Node> = rc.borrow();
            if node.g < next_node.g {
                next_node = node;
            }
        });
        Option::Some(next_node.pos)
    }

    pub fn refresh(&mut self) {
        let goal_node: Node = Node::new(self.goal);
        while self.get_top_key() < self.calculate_key(&goal_node) || goal_node.rhs != goal_node.g {
            let mut rc: NodeRc = self.queue.pop().unwrap();
            let rc_clone: NodeRc = Rc::clone(&rc);
            let mut node: RefMut<'_, Node> = rc_clone.borrow_mut();
            if node.g > node.rhs {
                node.g = node.rhs;
            } else {
                node.g = i32::MAX;
                self.update_node(&mut rc);
            }
            node.adjacent(self).iter().for_each(|successor: &NodeRc| {
                self.update_node(&successor);
            });
        }
    }

    fn update_node(&mut self, rc: &NodeRc) {
        let mut node: RefMut<'_, Node> = rc.borrow_mut();
        if node.pos != self.start.borrow().pos {
            let mut new_rhs: i32 = i32::MAX;
            node.adjacent(self).iter().for_each(|pre: &NodeRc| {
                let predecessor: Ref<'_, Node> = pre.borrow();
                new_rhs = i32::min(new_rhs, predecessor.g + predecessor.get_cost_to(&rc));
            });
            node.rhs = new_rhs;
            if self.queue.contains(rc) {
                self.queue.remove(
                    self.queue
                        .iter()
                        .position(|n: &NodeRc| n.borrow().pos == node.pos)
                        .unwrap(),
                );
            }
            if node.g != node.rhs {
                self.add_rc_to_queue(Rc::clone(&rc));
            }
        }
    }
}
