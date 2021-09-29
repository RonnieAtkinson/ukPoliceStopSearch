// ==========================================================================
// STOP SEARCH
// ==========================================================================

import { Navigation } from './navigation';
import { Loader } from './loader';

export class StopSearch {
    constructor(forceId, forceName, date) {
        this.forceId = forceId;
        this.forceName = forceName;
        this.date = date; // optional (YYYY-MM)

        this.domEl = {
            title: '.ss-title',
            total: '.ss-total',
            gender: '.ss-gender',
            ageRange: '.ss-agerange',
            involvedPerson: '.ss-person',
            objectSearch: '.ss-object',
            outcome: '.ss-outcome',
            noData: '.ss-nodata'
        };

        this.baseUrl = 'https://data.police.uk/api/';
        this.stopSearchBackBtn = document.getElementById('ss-back-btn');
        this.getStopSearch();
    };

    //
    // BACK BUTTON HANDLER
    //
    backButtonHandler(event) {
        event.preventDefault();
        Navigation.gotoView('ss-widget-home');
    };

    //
    // ENABLE BACK BUTTON
    //
    enableBackButton() {
        this.stopSearchBackBtn.addEventListener('click', this.backButtonHandler);
    };

    //
    // DISABLE BACK BUTTON
    //
    disableBackButton() {
        this.stopSearchBackBtn.removeEventListener('click', this.backButtonHandler);
    };

    //
    // Set the text content of an element
    //
    // [1] If no element id or value params are provided return
    // [2] Store the reference to the element
    // [3] If no domEl is set return
    // [4] Set the text content to the value param
    // 
    domTextContent(value, el, child, childClass) {
        if (!value || !el) return; // [1]

        const domEl = document.querySelector(el);

        if (!domEl) return; // [3]

        if (child) {
            const childEl = this.domCreateElement(child);

            if (childClass) childEl.classList = childClass;
            childEl.textContent = value;

            domEl.appendChild(childEl);
            return;
        };

        domEl.textContent = value; // [4]
    };

    //
    // Removes all children of an element
    //
    domRemoveChildren(el) {
        if (!el) return;
        while (el.firstChild) {
            el.firstChild.remove();
        };
    };

    //
    // REMOVE ALL CHILDREN
    //
    cleanSlate() {
        for (const el in this.domEl) {
            const targetEl = document.querySelector(this.domEl[el]);
            if (!targetEl) continue;
            this.domRemoveChildren(targetEl);
        };
    };

    //
    // Create element helper
    //
    domCreateElement(nodeType, classValue, text) {
        if (!nodeType) return;
        const el = document.createElement(nodeType);
        if (!el) return;
        if (classValue) el.classList = classValue;
        if (text) el.textContent = text;

        return el;
    };

    //
    // CREATE ELEMENT FROM
    //
    // Create html elements from a dataset and render to the dom.
    //
    // [1] If either the data or parentId param are not provided return
    // [2] Store a reference to the parentId element
    // [3] If the target element is null return
    //     # If this does return then the provided parentId does not exist
    // [4] Remove any existing children from the targetEl
    // 
    // For each data point lets create a child element
    // [5] If the datapoint label is null skip it
    // [6] Replace any spaces in the datapoint name with '-' and make it lowercase
    //     # This is for use in an id attribute
    // [7] Create a new 'div' element and assign an id attribute
    // [8] Create a new 'span' element, assign an id attribute, and populate it with the datapoint LABEL
    // [9] Create a new 'span' element, assign an id attribute, and populate it with the datapoint VALUE
    // [10] Append the LABEL to a parent
    // [11] Append the VALUE to a parent
    // [12] Append the PARENT to the target element
    //
    createElFrom(data, parentEl, title) {
        if (!data || !parentEl) return; // [1]

        const targetEl = document.querySelector(parentEl); // [2]
        const parentString = parentEl.replace(/\./g, '');

        if (!targetEl) return; // [3]

        if (Object.keys(data).length === 0) {
            console.log(`No data for ${parentEl}`);
            return;
        };

        const wrapperEl = this.domCreateElement('div', 'dataset__inner');

        if (title) {
            const titleEl = this.domCreateElement('span', `${parentString}__title dataset__title`, title);
            wrapperEl.append(titleEl);
        };

        for (const dataPoint in data) {
            // if (dataPoint === 'null') {
            //     continue; // [5]
            // };

            const idString = dataPoint.replace(/\s/g, '-').toLowerCase(); // [6]

            const dataPointChildEl = this.domCreateElement('div', `${parentString}__${idString} datapoint`); // [7]
            const dataPointLabelEl = this.domCreateElement('span', `${parentString}__label datapoint__label`, dataPoint); // [8]
            const dataPointValueEl = this.domCreateElement('span', `${parentString}__value datapoint__value`, data[dataPoint] ? data[dataPoint] : '0'); // [9]

            dataPointChildEl.append(dataPointLabelEl); // [10]
            dataPointChildEl.append(dataPointValueEl); // [11]

            wrapperEl.append(dataPointChildEl);
            targetEl.append(wrapperEl);
        };
    };

    //
    // DOM NO DATA
    //
    domNoData() {
        const targetEl = document.querySelector(this.domEl.noData);
        targetEl.textContent = 'No data available';
    };

    //
    // Render stop and search data
    //
    render(data) {
        if (!data.total['Total']) { // No data available for this month
            this.domNoData();
            return;
        };

        this.createElFrom(data.total, this.domEl.total);
        this.createElFrom(data.gender, this.domEl.gender, 'Gender');
        this.createElFrom(data.ageRange, this.domEl.ageRange, 'Age range');
        this.createElFrom(data.involvedPerson, this.domEl.involvedPerson, 'Involved a person');
        this.createElFrom(data.objectSearch, this.domEl.objectSearch, 'Stop and search reason');
        this.createElFrom(data.outcome, this.domEl.outcome, 'Outcome of the stop');
        console.log(data);

        return this;
    };

    //
    // GROUP BY AND COUNT
    //
    // Group data by key and count the occurances of the value
    //
    groupByAndCount(objectArray, property) {
        return objectArray.reduce((acc, obj) => {
            const key = (obj[property] === null || obj[property] === '') ? 'Not recorded' :
                (obj[property] === true) ? 'Yes' :
                (obj[property] === false) ? 'No' :
                obj[property];

            if (!acc.hasOwnProperty(key)) {
                acc[key] = 0;
            };

            acc[key]++;
            return acc;
        }, {});
    };

    //
    // GROUP BY DAY
    //
    // 0 == sunday
    //
    groupByDay(objectArray, property) {
        return objectArray.reduce((acc, obj) => {
            // const key = obj[property];

            const weekday = new Date(obj[property]);
            const key = weekday.getDay();

            if (!acc[key]) {
                acc[key] = [];
            }
            // acc[key].push(obj);
            acc[key]++;
            return acc;
        }, {});
    };

    //
    // BUILD DATA SET
    //
    buildDataSet(data) {
        const ssGender = this.groupByAndCount(data, 'gender');
        const ssAge = this.groupByAndCount(data, 'age_range');
        const ssPerson = this.groupByAndCount(data, 'involved_person');
        const ssObject = this.groupByAndCount(data, 'object_of_search');
        const ssOutcome = this.groupByAndCount(data, 'outcome');
        const ssDate = this.groupByDay(data, 'datetime');

        // console.log('GENDER:', ssGender);
        // console.log('OUTCOME:', ssOutcome);

        const dataSet = {
            total: {
                'Total': data.length,
            },
            ageRange: {
                'under 10': 0,
                '10-17': 0,
                '18-24': 0,
                '25-34': 0,
                'over 34': 0
            },
            gender: {
                'Male': 0,
                'Female': 0,
                'Other': 0,
            },
            involvedPerson: {
                'Yes': 0,
                'No': 0
            },
            objectSearch: {},
            outcome: {},
            dayOfWeek: {}
        };

        for (const gender in ssGender) {
            dataSet.gender[gender] = ssGender[gender];
        };

        for (const age in ssAge) {
            dataSet.ageRange[age] = ssAge[age];
        };

        for (const person in ssPerson) {
            dataSet.involvedPerson[person] = ssPerson[person];
        };

        for (const object in ssObject) {
            dataSet.objectSearch[object] = ssObject[object];
        };

        for (const outcome in ssOutcome) {
            dataSet.outcome[outcome] = ssOutcome[outcome];
        };

        for (const day in ssDate) {
            dataSet.dayOfWeek[day] = ssDate[day];
        };

        this.render(dataSet);
    };

    //
    // FETCH STOP AND SEARCH DATA
    //
    // Get stop and search data by force id
    // See: https://data.police.uk/docs/method/stops-force/
    // example: https://data.police.uk/api/stops-force?force=avon-and-somerset
    // example: https://data.police.uk/api/stops-force?force=avon-and-somerset&date=2020-01
    //
    // [1] 
    //     # Returns a promise
    //     # Promise is resolved once the request completes
    // [2] 
    // [3] Extract the JSON object from response
    //     # Returns a promse resolved to a JSON object
    // [4]
    // 
    async getStopSearch() {
        try {
            this.cleanSlate();

            this.disableBackButton();

            this.domTextContent(this.forceName, `${this.domEl.title}`, 'h1');
            this.domTextContent('July 2021 Stop and search data', `${this.domEl.title}`, 'span');

            await Loader.show(); // [1]

            const response = await fetch(`${this.baseUrl}/stops-force?force=${this.forceId}&date=2021-07`); // [1]

            if (!response.ok) {
                throw new Error(`${response.status}: Response is NOT OK!!!`); // [2]
            };

            const data = await response.json(); // [3]
            // console.log(data);

            this.buildDataSet(data);

        } catch (err) {
            console.log(err);
            this.domNoData();

        } finally {
            Loader.hide();
            this.enableBackButton();
        };

        return this;
    };
};