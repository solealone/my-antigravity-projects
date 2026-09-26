document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab-btn');
    const singleForm = document.getElementById('single-upload-form');
    const bulkContent = document.getElementById('bulk-upload-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            const tabName = tab.getAttribute('data-tab');

            if (tabName === 'single') {
                singleForm.style.display = 'block';
                bulkContent.style.display = 'none';
            } else if (tabName === 'bulk') {
                singleForm.style.display = 'none';
                bulkContent.style.display = 'block';
            } else {
                // Handle Assignment tab or others
                console.log('Assignment tab clicked');
            }
        });
    });

    // Add simple animation to form inputs on focus
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
});
