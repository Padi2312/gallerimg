let options: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
};

export const lazyLoad = (image: HTMLImageElement, src: string) => {
    const loaded = () => {
        image.setAttribute('style', 'opacity: 1;');  // Apply the loading animation
    };

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            image.src = src;  // Replace placeholder src with the actual image src
            if (image.complete) {
                loaded();  // If the image loads instantly
            } else {
                image.addEventListener('load', loaded);  // Add event listener if the image isn't loaded yet
            }
        }
    }, options);

    $effect(() => {
        observer.observe(image);  // Start observing the image

        return () => {
            observer.unobserve(image);  // Unobserve when the component is destroyed
            image.removeEventListener('load', loaded);  // Clean up the event listener
            observer.disconnect();  // Disconnect the observer
        };
    });


    return {
        destroy() {
            image.removeEventListener('load', loaded);  // Clean up the event listener
        }
    };
};
