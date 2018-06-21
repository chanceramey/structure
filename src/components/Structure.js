import Vue from "vue";
import Node from "./Node";
import Modal from "./Modal";

export default Vue.component("Structure", {
    render: function (h) {
        let structure = this.generateStructure(h);
        return (
            <div class="structure">
            {this.deleteModal && <Modal onRequestClose={() => this.toggleModal()}>
                <h2>What would you like to do with this node's children?</h2>
                <button class="alternate" onClick={this.deleteMe()}>Append child nodes to grandparent</button>
                <button class="harsh">Delete all child nodes</button>
            </Modal>}
                {structure}
            </div>
        );
    },
    computed: {
        currentStructure: function () {
            return this.$store.getters.currentStructure;
        },
    },
    created: function () {
        this.mutableStructure = JSON.parse(JSON.stringify(this.currentStructure));
    },
    data: function () {
        return {
            mutableStructure: {},
            deleteModal: false,
            parent: {},
            index: {}
        }
    },
    methods: {
        toggleModal: function(value, parent, index) {
            if (parent) this.parent = parent;
            if (index) this.index = index;
            console.log("calling toggle modal")
            this.deleteModal = value !== undefined ? value : !this.deleteModal; 
            console.log(this.deleteModal)
        },
        deleteMe: function () {
            const parent = this.parent;
            const index = this.index;
            parent && parent.children && parent.children.splice(index, 1)
            this.$store.dispatch("saveBoard", this.mutableStructure)
        },
        deleteJustMe: function () {
            const toDelete = parent && parent.children[index]
            parent && parent.children && parent.children.splice(index, 1)
            parent.children = [...parent.children, ...toDelete.children];
            this.$store.dispatch("saveBoard", this.mutableStructure)
        },
        generateStructure: function (h) {
            return this.structureHelper(h, this.mutableStructure.root, null, null)
        },
        updateNode: function (nodeObject, newNodeValues) {
            if (newNodeValues.title) nodeObject.title = newNodeValues.title;
            if (newNodeValues.description) nodeObject.description = newNodeValues.description;
            this.$store.dispatch("saveBoard", this.mutableStructure)
        },
        pushChild: function (nodeObject) {
            if (!nodeObject.children) nodeObject.children = [];
            nodeObject.children.push({
                title: '',
                description: '',
                children: []
            });
            this.$store.dispatch("saveBoard", this.mutableStructure)
        },
        pushSibling: function (parent) {
            parent && parent.children.push({
                title: '',
                description: '',
                children: []
            });
            this.$store.dispatch("saveBoard", this.mutableStructure)
        },
        reorder: function (parent, index) {
            if (!parent || !parent.children) return;
            const node = parent.children[index];
            parent.children.splice(index, 1);
            if (index === 0) parent.children.push(node);
            else parent.children.splice(index - 1, 0, node);
            console.log(JSON.stringify(parent, undefined, 4))
            this.$store.dispatch("saveBoard", this.mutableStructure)
            this.triggerRefresh = new Date().getMilliseconds();
        },
        structureHelper: function (h, node, parent, index) {
            if (!node) return;
            let children = [];
            if (node.children && node.children.length > 0) {
                for (let index in node.children) {
                    let child = node.children[index];
                    children.push(this.structureHelper(h, child, node, index));
                }
            }
            return (
                <Node node={node}
                    toggleModal={this.toggleModal}
                    parent={parent}
                    index={index}
                    update={this.updateNode}
                    addChild={this.pushChild}
                    deleteNode={this.deleteMe}
                    deleteThisNodeOnly={this.deleteJustMe}
                    addSibling={this.pushSibling}
                    reorder={this.reorder}>
                    {children}
                </Node>
            )
        }
    }
});

// Test stuff below

const nodeTemplate = {
    title: '',
    description: '',
    children: []
}

const testBoard = {
    title: "Test Board",
    description: "Testing board",
    root: {
        title: "Root Node",
        description: "Description for root",
        children: [
            {
                title: "Child 1",
                description: "Description for child 1",
                children: [{
                    title: "First Grandchild",
                    description: "Description for only grandchild"
                },
                {
                    title: "Second Grandchild",
                    description: "Description for only grandchild"
                }]
            },
            {
                title: "Child 2",
                description: "Description for child 2",
                children: []
            }
        ]
    }
}
