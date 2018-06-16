import Vue from "vue";
import Node from "./Node";

export default Vue.component("Structure", {
    render: function (h) {
        let structure = this.generateStructure(h);
        return (
            <div class="structure">
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
            mutableStructure: {}
        }
    },
    methods: {
        deleteMe: function (parent, index) {
            parent && parent.children.splice(index, 1)
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
                    parent={parent}
                    index={index}
                    update={this.updateNode}
                    addChild={this.pushChild}
                    deleteNode={this.deleteMe}
                    addSibling={this.pushSibling}>
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
