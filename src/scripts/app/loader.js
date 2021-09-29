// ==========================================================================
// LOADER
// ==========================================================================

export class Loader {
    //
    // Loader Element
    //
    static loaderEl = document.getElementById('loader');

    //
    // SHOW LOADER
    //
    // [1] Change the value of the css display property to block
    //     # Shows the loader to the user
    // [2] On fast load times the loader 'flickers', it shows quickly
    //     on screen before being removed. Not a great user experience.
    //     To prevent this i've added a promise that only resolves after
    //     a set amount of time.
    //
    //     # Forced waiting may also be considered a bad user experience
    //
    static async show(time = 500) {
        Loader.loaderEl.style.display = 'block'; // [1]
        await new Promise(resolve => setTimeout(resolve, time)); // [2]
    };

    //
    // Hide loader
    //
    // [1] Change the value of the css display property to none
    //     # Hides the loader from view
    //
    static hide() {
        Loader.loaderEl.style.display = 'none'; // [1]
    };
};