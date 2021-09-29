// ==========================================================================
// NAVIGATION
// ==========================================================================

export class Navigation {
    //
    // GO TO VIEW
    //
    // Show the view passed in the param and hide the rest
    //
    // [1] Get all the views
    // [2] Get the target view from the param
    // [3] If either the view or target view are empty return
    // [3] set the css display value to 'none' for all views
    // [4] Set the css display value to 'block' for the target view
    //
    static gotoView(elId) {
        if (!elId) return;

        const views = document.querySelectorAll('.ss-view'); // [1]
        const targetView = document.getElementById(elId); // [2]

        if (!views || !targetView) return; // [3]

        for (const view of views) {
            view.style.display = 'none' // [4]
        };

        targetView.style.display = 'block' // [5]
    };
};