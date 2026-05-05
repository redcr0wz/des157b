(function(){
    'use strict';

    gsap.registerPlugin(SplitText, Draggable, InertiaPlugin);

    const text = document.querySelector("#text");
    const footerLinks = document.querySelectorAll("footer a");

    let split = SplitText.create("#text", { type: "words, chars" });

    // initial animation
    gsap.from(split.chars, {
        duration: 1,
        y: 50,
        autoAlpha: 0,
        stagger: 0.05
    });

    text.addEventListener("mouseenter", () => {
        gsap.to(split.chars, {
            y: -10,
            color: "#efa364",
            duration: 0.3,
            stagger: 0.02
        });
    });

    text.addEventListener("mouseleave", () => {
        gsap.to(split.chars, {
            y: 0,
            color: "#ffffff",
            duration: 0.3,
            stagger: 0.02
        });
    });

    let isDragMode = false;

    function switchText(newText) {
        gsap.to(split.chars, {
            y: -40,
            autoAlpha: 0,
            stagger: 0.03,
            duration: 0.3,
            onComplete: () => {

                split.revert();
                text.innerHTML = newText;

                split = SplitText.create("#text", { type: "words, chars" });

                gsap.from(split.chars, {
                    y: 40,
                    autoAlpha: 0,
                    stagger: 0.03,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
    }

    text.addEventListener("click", () => {

        // rotation animation (before switch)
        gsap.to(split.chars, {
            rotation: 360,
            scale: 1.2,
            duration: 0.6,
            stagger: 0.04,
            ease: "back.out(2)",
            onComplete: () => {
                gsap.to(split.chars, {
                    rotation: 0,
                    scale: 1,
                    duration: 0.3
                });
            }
        });

        // toggle text
        isDragMode = !isDragMode;
        switchText(isDragMode ? "Drag me!" : "Click me!");
    });

    Draggable.create("#text", {
        bounds: "body",
        inertia: true
    });

    footerLinks.forEach(link => {
        let splitLink = SplitText.create(link, { type: "chars" });

        link.addEventListener("mouseenter", () => {
            gsap.to(splitLink.chars, {
                y: -8,
                color: "#739ef4",
                stagger: 0.03,
                duration: 0.3
            });
        });

        link.addEventListener("mouseleave", () => {
            gsap.to(splitLink.chars, {
                y: 0,
                color: "#ffffff",
                stagger: 0.03,
                duration: 0.3
            });
        });
    });

    // background
    new Granim({
        element: '#granim-canvas',
        name: 'granim',
        opacity: [1, 1],
        states : {
            "default-state": {
                gradients: [
                    ['#101012', '#506377'],
                    ['#672d19', '#100d0b']
                ]
            }
        }
    });
}());