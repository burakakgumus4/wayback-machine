document.addEventListener('DOMContentLoaded', (event) => {
    const splitter = document.getElementById('splitter');
    const iframe1 = document.getElementById('iframe1');
    const iframe2 = document.getElementById('iframe2');

    let isDragging = false;

    const startDrag = function(e) {
        isDragging = true;
        document.body.style.cursor = 'ew-resize';
        e.preventDefault();  // Prevent text selection during drag
    };

    const doDrag = function(e) {
        if (!isDragging) return;
        let offsetLeft = e.clientX;
        let totalWidth = document.body.offsetWidth;
        let percentageLeft = (offsetLeft / totalWidth) * 100;
        let percentageRight = 100 - percentageLeft;
        iframe1.style.width = `${percentageLeft}%`;
        iframe2.style.width = `${percentageRight}%`;
    };

    const stopDrag = function() {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = 'default';
        }
    };

    splitter.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('mouseleave', stopDrag);  // Handle the case when the mouse leaves the window

    // Function to inject Google Translate script into iframe2
    const injectTranslateScript = function() {
        const iframeDocument = iframe2.querySelector('iframe').contentDocument || iframe2.querySelector('iframe').contentWindow.document;
        const script = iframeDocument.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        iframeDocument.head.appendChild(script);

        const translateInitScript = iframeDocument.createElement('script');
        translateInitScript.type = 'text/javascript';
        translateInitScript.innerHTML = `
            function googleTranslateElementInit() {
                new google.translate.TranslateElement({pageLanguage: 'tr', includedLanguages: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
            }
        `;
        iframeDocument.head.appendChild(translateInitScript);

        const translateElementDiv = iframeDocument.createElement('div');
        translateElementDiv.id = 'google_translate_element';
        iframeDocument.body.insertBefore(translateElementDiv, iframeDocument.body.firstChild);
    };

    // Add an event listener to iframe2 to wait until it's fully loaded
    iframe2.querySelector('iframe').addEventListener('load', function() {
        injectTranslateScript();
    });
});
