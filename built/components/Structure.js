"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var Node_1 = require("./Node");
var Modal_1 = require("./Modal");
exports.default = vue_1.default.component("Structure", {
    render: function (h) {
        var _this = this;
        var structure = this.generateStructure(h);
        return (<div class="structure">
            {this.deleteModal && <Modal_1.default onRequestClose={function () { return _this.toggleModal(); }}>
                <h2>What would you like to do with this node's children?</h2>
                <button class="alternate" onClick={this.deleteMe()}>Append child nodes to grandparent</button>
                <button class="harsh">Delete all child nodes</button>
            </Modal_1.default>}
                {structure}
            </div>);
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
        };
    },
    methods: {
        toggleModal: function (value, parent, index) {
            if (parent)
                this.parent = parent;
            if (index)
                this.index = index;
            console.log("calling toggle modal");
            this.deleteModal = value !== undefined ? value : !this.deleteModal;
            console.log(this.deleteModal);
        },
        deleteMe: function () {
            var parent = this.parent;
            var index = this.index;
            parent && parent.children && parent.children.splice(index, 1);
            this.$store.dispatch("saveBoard", this.mutableStructure);
        },
        deleteJustMe: function () {
            var toDelete = parent && parent.children[index];
            parent && parent.children && parent.children.splice(index, 1);
            parent.children = parent.children.concat(toDelete.children);
            this.$store.dispatch("saveBoard", this.mutableStructure);
        },
        generateStructure: function (h) {
            return this.structureHelper(h, this.mutableStructure.root, null, null);
        },
        updateNode: function (nodeObject, newNodeValues) {
            if (newNodeValues.title)
                nodeObject.title = newNodeValues.title;
            if (newNodeValues.description)
                nodeObject.description = newNodeValues.description;
            this.$store.dispatch("saveBoard", this.mutableStructure);
        },
        pushChild: function (nodeObject) {
            if (!nodeObject.children)
                nodeObject.children = [];
            nodeObject.children.push({
                title: '',
                description: '',
                children: []
            });
            this.$store.dispatch("saveBoard", this.mutableStructure);
        },
        pushSibling: function (parent) {
            parent && parent.children.push({
                title: '',
                description: '',
                children: []
            });
            this.$store.dispatch("saveBoard", this.mutableStructure);
        },
        reorder: function (parent, index) {
            if (!parent || !parent.children)
                return;
            var node = parent.children[index];
            parent.children.splice(index, 1);
            if (index === 0)
                parent.children.push(node);
            else
                parent.children.splice(index - 1, 0, node);
            console.log(JSON.stringify(parent, undefined, 4));
            this.$store.dispatch("saveBoard", this.mutableStructure);
            this.triggerRefresh = new Date().getMilliseconds();
        },
        structureHelper: function (h, node, parent, index) {
            if (!node)
                return;
            var children = [];
            if (node.children && node.children.length > 0) {
                for (var index_1 in node.children) {
                    var child = node.children[index_1];
                    children.push(this.structureHelper(h, child, node, index_1));
                }
            }
            return (<Node_1.default node={node} toggleModal={this.toggleModal} parent={parent} index={index} update={this.updateNode} addChild={this.pushChild} deleteNode={this.deleteMe} deleteThisNodeOnly={this.deleteJustMe} addSibling={this.pushSibling} reorder={this.reorder}>
                    {children}
                </Node_1.default>);
        }
    }
});
// Test stuff below
var nodeTemplate = {
    title: '',
    description: '',
    children: []
};
var testBoard = {
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
};
