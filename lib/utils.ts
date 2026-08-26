export const triggerCapture = (openCheckout: (img: string) => void) => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const imgData = canvas.toDataURL("image/jpeg", 0.9);
        openCheckout(imgData);
    }
};