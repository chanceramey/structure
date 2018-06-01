import Vue from "vue";
import Node from "./Node";

// *** TODO ***
// Immediately 
// X Create a board should take you directly to the board
// X Start with title only, create a description on 'TAB'
// * Save (w/ autosave) or prompt save (w/out autosave) on logout (on Enter?)
// * Implement invisible saves to NEVER lose data
// X Create a sibling with 'ENTER'
// X Create a child with 'SHIFT-ENTER'
// * Control how to tabbing through tree works
// X Focus on title when a new item is created
// * Allow reordering of siblings
// * Delete a parent and ask what to do with childen (delete)
// * Fix Workspace so that it expands with structure
// * Fix background so that the whole thing changes when building a structure (use routes?)
// * Start showing structures from database
// * Fix save feature
// X Fix delete feature
// * Add lines to structures
// * Filter all inputs and endpoints (middleware?) to check for SQL injections
// X Remove board title and description and make them part of the root node
// X Add JS Web Token to front and backend
// * Fix login password field
// * Figure out the best way to way a todo list (allow for sub-structures/hidden structures?)
// * Configure database to work with larger structures
// X Change name of tree (Structure) or Structure (Workspace?) component to remove confusion
// * Add generate report feature
// * Add delete board to Boards page
// * Restyle list of boards
// * Add content and styling to homepage
// * Create a version history
// * Move to Typescript
// * Host on the web
// * Create instuction modal AND/OR persistent modal
// * Add font-awesome icons
// X Fix delete
// * Restyle boards page
// * Add animations to new buckets
// * Create ideal (patentable?) solution for viewing
// * Create idea (patentable?) navigation, editing, & creation

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
// * Make Control/Command+s save
// * Make Control/Command+p Print Report

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
