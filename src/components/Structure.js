import Vue from "vue";
import Node from "./Node";

// *** TODO ***
// Immediately 
// * Create a board should take you directly to the board
// * Start with title only, create description on 'TAB'
// * Create sibling with 'ENTER'
// * Create child with 'SHIFT-ENTER'
// * Allow reordering of siblings
// * Delete a parent and ask what to do with childen (delete)
// * Fix Workspace so that it expands with structure
// * Fix background so that the whole thing changes when building a structure (use routes?)
// * Start showing structures from database
// * Fix save feature
// * Fix delete feature
// * Add lines to structures
// * Filter all inputs to check for SQL injections
// * * Remove board title and description and make them part of the root node
// * Add JS Web Token to front and backend
// * Fix login password field
// * Figure out the best way to way a todo list (allow for sub-structures/hidden structures?)
// * Configure database to work with larger structures
// * * Change name of tree (Structure) or Structure (Workspace?) component to remove confusion
// * Add generate report feature
// * Add delete board to Boards page
// * Restyle list of boards
// * Add content and styling to homepage
// * Create a version history
// * Move to Typescript
// * Host on the web

// Soon
// * Create invite only access
// * Get feedback from BYU management consultants
// * Get a good developer or developers to review my code (Josh Cockrell? Lincoln? Kid who taugh Vue)
// * Create Terms of Service and Privacy Policy
// * File for provisional patents for DB structure and quick diagraming


// Later:
// * Add copy and paste to do list
// * Integrate with Google calendars and evernote
// * Add Node Modal
// * Add Team collaboration
// * Add project ownership
// * Add project flow/status feature
// * Determine paid features?
// * Add payments?
// * Create a developer API

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
        }
    },
    created: function () {
        console.log(JSON.stringify(this.currentStructure, null, 4));
    },
    data: function () {
        return {
        }
    },
    methods: {
        deleteMe: function (node) {
            console.log("deleting node")
            node = {};
            console.log(JSON.stringify(this.currentStructure, null, 4));

        },
        generateStructure: function (h) {
            return this.structureHelper(h, this.currentStructure.root)
        },
        updateNode: function (nodeObject, newNodeValues) {
            if (newNodeValues.title) nodeObject.title = newNodeValues.title;
            if (newNodeValues.description) nodeObject.description = newNodeValues.description;
            this.$store.dispatch("saveBoard", this.testBoard)
            console.log(JSON.stringify(this.testBoard, null, 4));
        },
        pushChild: function (nodeObject) {
            console.log(`Before: ${JSON.stringify(this.currentStructure, null, 4)}`)
            if (!nodeObject.children) nodeObject.children = [];
            nodeObject.children.push({
                title: '',
                description: '',
                children: []
            });
            console.log(`After: ${JSON.stringify(this.currentStructure, null, 4)}`)

        },
        structureHelper: function (h, node) {
            if (!node) return;
            let children = [];
            if (node.children && node.children.length > 0) {
                for (let child of node.children) {
                    children.push(this.structureHelper(h, child))
                }
            }
            return (
                <Node node={node} update={this.updateNode} addChild={this.pushChild} deleteNode={this.deleteMe}>
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
