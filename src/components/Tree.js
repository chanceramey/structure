import Vue from "vue";
import Node from "./Node";

export default Vue.component("Tree", {
    render: function (h) {
        let tree = this.generateTree(h, "test", "description");
        return (
            <div class="tree">
                {tree}
            </div>
        );
    },
    computed: {
    },
    created: function () {
        console.log(JSON.stringify(this.testBoard, null, 4));
    },
    data: function () {
        return {
            testBoard: {
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
                            },
                            {
                                title: "Third Grandchild",
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
        }
    },
    methods: {
        renderNode: function (h, title, description) {
            return <Node title={title} description={description} />;
        },
        generateTree: function (h) {
            return this.treeHelper(h, this.testBoard.root)
        },
        updateNode: function (nodeObject, newNodeValues) {
            if (newNodeValues.title) nodeObject.title = newNodeValues.title;
            if (newNodeValues.description) nodeObject.description = newNodeValues.description;
            console.log(JSON.stringify(this.testBoard, null, 4));
        },
        treeHelper: function (h, node) {
            if (!node) return;
            let children = [];
            if (node.children && node.children.length > 0) {
                for (let child of node.children) {
                    children.push(this.treeHelper(h, child))
                }
            }
            return (
                <Node node={node} update={this.updateNode}>
                    {children}
                </Node>
            )


        }
    }
});
