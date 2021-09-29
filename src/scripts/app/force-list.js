// ==========================================================================
// FORCE LIST
// ==========================================================================

import { Navigation } from './navigation';
import { Loader } from './loader';
import { StopSearch } from './stop-search';

export class ForceList {
    constructor() {
        this.forceListEl = document.getElementById('force-list');
        this.forceListBtn = document.getElementById('force-btn');
        this.baseUrl = 'https://data.police.uk/api/';
        this.getForces();
        this.enableClick();
    };

    //
    // RENDER
    //
    // Loops through the force data and renders a list of forces to the DOM
    //
    // [1] Create a new 'option' html element
    // [2] Populate the value attribute of the option element with the force id
    // [3] Populate the text of the option element with the force name
    // [4] Append the option element to the select element
    // 
    render(forceData) {
        for (const force of forceData) {
            const forceOption = document.createElement('option'); // [1]

            forceOption.value = force.id; // [2]
            forceOption.textContent = force.name; // [3]

            this.forceListEl.appendChild(forceOption); // [4]
        };

        return this;
    };

    //
    // ENABLE CLICK
    //
    // # Changed this, need to update comment
    //
    // Rather than assigning an event to every element which might impact
    // performance we'll use event delegation here.
    //
    // [1] Prevent the default click behaviour
    // [2] Get the closest anchor to the click
    // [3] Get the force id from the element dataset
    // [4] Create a new instance of the stopSerch class passing the force id
    // 
    enableClick() {
        this.forceListBtn.addEventListener('click', event => {
            event.preventDefault(); // [1]

            const forceId = this.forceListEl.value;
            const forceName = this.forceListEl.options[this.forceListEl.selectedIndex].text;

            console.log(forceName);

            Navigation.gotoView('ss-widget-data');
            new StopSearch(forceId, forceName);
        });

        return this;
    };

    //
    // GET FORCES
    //
    // Get a list of police forces
    // See: https://data.police.uk/docs/method/forces/
    // Example: https://data.police.uk/api/forces
    //
    // [1] Lets show the loader while the user is waiting
    // [2] Fetch a list of police forces
    // [3] If the response is not ok throw an error
    // [4] Store the json response
    // [5] Call the render method
    //
    // If theres an error
    // [6] Log the error
    //     # Need to implement an error handler
    //
    // Finally
    // This will run even if an error occurs
    // [7] Hide the loader
    //
    async getForces() {
        try {
            await Loader.show(); // [1]

            const response = await fetch(`${this.baseUrl}/forces`); // [2]

            if (!response.ok) {
                throw new Error(`${response.status}: Response is NOT OK!!!`); // [3]
            };

            const data = await response.json(); // [4]

            this.render(data); // [5]

        } catch (err) {
            console.log(err); // [6]

        } finally {
            Loader.hide(); // [7]

        };

        return this;
    };
};