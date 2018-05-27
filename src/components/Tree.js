import Vue from "vue";
import Node from "./Node";

export default Vue.component("Tree", {
    render: function (h) {
        let node = this.generateTree(h, "test", "description");
        console.log(node)
        return (
            <div>
                {node}
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
                                title: "Only Grandchild",
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
            },
            testBoard2: {
                title: "Test Board",
                description: "Testing board",
                root: {
                    title: "Root Node",
                    description: "Description for root",
                    children: [
                        {
                            title: "Child 1",
                            description: "Description for child 1",
                            children: []
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
        treeHelper: function (h, node) {
            if (!node) return;
            let children = [];
            if (node.children && node.children.length > 0) {
                for (let child of node.children) {
                    children.push(this.treeHelper(h, child))
                }
            }
            return (
                <Node title={node.title} description={node.description}>
                    {children}
                </Node>
            )


        }
    }
});