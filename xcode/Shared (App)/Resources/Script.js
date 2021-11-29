function show(platform, enabled) {
    document.body.classList.add(`platform-${platform}`);

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled);
        document.body.classList.toggle(`state-off`, !enabled);
    } else {
        document.body.classList.remove(`state-on`);
        document.body.classList.remove(`state-off`);
    }
}

function subscribe() {
    webkit.messageHandlers.controller.postMessage("open-subscription");
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences");
}

document.querySelector("button.open-preferences").addEventListener("click", openPreferences);

document.querySelector(".help a").addEventListener("click", (ev) => {
    ev.preventDefault();
    webkit.messageHandlers.controller.postMessage("open-support");
    return false;
});
