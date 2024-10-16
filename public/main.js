/*Look at https://www.federalistpig.com/ for inspo */
window.addEventListener("load", function () {

    // Hide loading screen
    gsap.to("#loading-screen", { duration: 1, opacity: 0, display: 'none' });

    gsap.from(".logo", { duration: 1, delay: .6, y: 30, opacity: 0, ease: "power2.inOut" });
    gsap.from(".nav-links", { duration: 1, delay: .6, y: 30, opacity: 0, ease: "power2.inOut" });
    gsap.from(".animation-mobile-btns", { duration: 1, delay: .6, x: 30, opacity: 0, ease: "power2.inOut" });
    gsap.from(".animation-section-heading", { duration: 1, delay: .7, opacity: 0, y: 30, ease: "power1.inOut" });
    gsap.from(".animation-section-accent", { duration: 1, delay: .8, opacity: 0, y: 30, ease: "power1.inOut" });
    gsap.from(".animation-section-p", { duration: 1, delay: .9, opacity: 0, y: 30, ease: "power1.inOut" });
    gsap.from(".animation-general-element", { duration: 1, delay: .9, opacity: 0, y: 30, ease: "power1.inOut" });
    gsap.from(".button-CTA", { duration: 1, delay: 1, opacity: 0, ease: "power1.inOut" });
    gsap.fromTo('.column-footer-top-row', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });
    gsap.fromTo('.column-footer-bottom-row', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });

    gsap.to(".navbar", { duration: 0, visibility: "visible" });
    gsap.to(".container-hero", { duration: 0, visibility: "visible" });
    gsap.to(".container-about", { duration: 0, visibility: "visible" });
    gsap.to(".container-cards", { duration: 0, visibility: "visible" });
    gsap.to(".container-footer", { duration: 0, visibility: "visible" });

    document.querySelector('.column-hero-left').classList.add('background-animation');


    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    // Toggle mobile menu and hamburger animation
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });


    const serverApiMenuUrl = 'https://zaytuna.onrender.com/api/menu';
    const serverApiReviewsUrl = 'https://zaytuna.onrender.com/api/reviews';
    const serverApiSubscribeUrl = 'http://localhost:3002/api/subscribe';
    // Fetch menu items on page load
    fetchMenuItems();
    fetchReviewsItems();

    const modal = document.getElementById('myModal');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('modal-close-button');
    const form = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    const modal_mobile = document.getElementById('modal-mobile');
    const closeBtn_mobile = document.getElementById('modal-close-button-mobile');
    const form_mobile = document.getElementById('form-modal-mobile');
    const modalTitle_mobile = document.getElementById('modal-title-mobile');
    const modalDescription_mobile = document.getElementById('modal-description-mobile');

    /*
        // Check if user details are already provided
        if (localStorage.getItem('userEmail') !== null) {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        }
    */
    closeBtn.onclick = function () {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }

    // Function to subscribe a user
    async function subscribeUser(email, discount_code) {
        try {
            const response = await fetch(serverApiSubscribeUrl, { // Adjust the URL if the server is hosted elsewhere
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, discount_code }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Subscriber added successfully:', data);
            } else {
                console.error('Error subscribing user:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    // Add an event listener for the form's submit event
    form.addEventListener('submit', function (event) {
        // Prevent the default form submission
        event.preventDefault();

        const email = document.getElementById('email').value;
        const discount_code = generateDiscountCode(email);

        subscribeUser(email, discount_code);

        if (email) {
            localStorage.setItem('userEmail', email);
            form.style.display = 'none';
            modalTitle.innerHTML = "You're in!🎉";
            modalDescription.style.lineHeight = '140%';
            modalDescription.style.fontFamily = 'var(--font-1)'
            modalDescription.innerHTML = "Your discount code is on the way to your inbox! We can't wait to serve you something delicious.💙<br><br>If you don't see it in your inbox within 1 minute, please check your spam folder.";
        }
    });

    // Add an event listener for the form's submit event
    form_mobile.addEventListener('submit', function (event) {
        // Prevent the default form submission
        event.preventDefault();

        const email = document.getElementById('email_mobile').value;
        const discount_code = generateDiscountCode(email);

        subscribeUser(email, discount_code);

        if (email) {
            localStorage.setItem('userEmail', email);
            form_mobile.style.display = 'none';
            modalTitle_mobile.innerHTML = "You're in!🎉";
            modalDescription_mobile.style.lineHeight = '140%';
            modalDescription_mobile.style.fontFamily = 'var(--font-1)'
            modalDescription_mobile.innerHTML = "Your discount code is on the way to your inbox! We can't wait to serve you something delicious.💙<br><br>If you don't see it in your inbox within 1 minute, please check your spam folder.";
            modal_mobile.style.minHeight = '30vh';
            modal_mobile.style.padding = '36px var(--container-spacing-horizontal)'
        }
    });

    function generateDiscountCode(email) {
        const prefix = email.split('@')[0].toUpperCase().slice(0, 4);
        const randomPart = Math.random().toString(36).substring(2, 10 - prefix.length).toUpperCase();
        console.log(prefix, randomPart)
        return prefix + randomPart;
    }



    const container_menu_cards = document.querySelector(".container-menu-cards");


    const reviews_slider = document.querySelector(".slider");
    const reviews_left_btn = document.querySelector("#reviews-left-btn");
    const reviews_right_btn = document.querySelector("#reviews-right-btn");
    updateSliderBtnVisibility(reviews_slider, reviews_left_btn, reviews_right_btn);



    function updateSliderBtnVisibility(slider, left_btn, right_btn) {
        function updateButtonVisibility() {
            //Recommendation & review section isn't the general container size as it spans 100% of the viewport width
            //So using the hero section as a general section for reference of how wide the containers are
            // Using this to make the main display for the cards, the same width as the containers.
            const container_hero = document.querySelector(".container-hero");
            const container_width = parseFloat(window.getComputedStyle(container_hero).width);
            //container_width is a good enough rough estimate. CSS will snap scroll.
            left_btn.onclick = () => { slider.scrollLeft -= container_width };
            right_btn.onclick = () => { slider.scrollLeft += container_width };

            if (slider.scrollLeft === 0) {
                left_btn.style.visibility = 'hidden';

            } else {
                left_btn.style.visibility = 'visible';
            }

            if (slider.clientWidth > slider.scrollWidth) {
                right_btn.style.visibility = 'hidden';
            }
            //Sometimes scrollLeftstops right before the end, so added the -10 for safety
            if (slider.scrollLeft > 0 && slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
                right_btn.style.visibility = 'hidden';

            }
            else {
                right_btn.style.visibility = 'visible';
            }


        }
        slider.addEventListener('scroll', updateButtonVisibility);
        updateButtonVisibility();

        // Create a ResizeObserver
        const resizeObserver = new ResizeObserver(entries => { updateButtonVisibility(); });

        // Start observing the resizableDiv for size changes
        resizeObserver.observe(slider);

    }





    // Function to fetch data from the server
    async function fetchMenuItems() {
        try {
            const response = await fetch(serverApiMenuUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch data from server');
            }
            const data = await response.json();
            displayMenuItems(data.records);
        } catch (error) {
            console.error(error);
            alert('Error fetching menu items. Please check the console for more details.');
        }
    }

    // Function to fetch data from the server
    async function fetchReviewsItems() {
        try {
            const response = await fetch(serverApiReviewsUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch data from server');
            }
            const data = await response.json();
            displayReviewItems(data.records);
        } catch (error) {
            console.error(error);
            alert('Error fetching menu items. Please check the console for more details.');
        }
    }

    // Function to display menu items


    // Function to display menu items
    function displayMenuItems(items) {
        container_menu_cards.innerHTML = ''; // Clear the container
        let htmlinjection = '';
        const menu_time = ['Breakfast', 'Lunch', 'Dinner'];
        const displayFilteredRecords = items.filter(item => item.fields.Display && item.fields.Feature != null);
        menu_time.forEach(time => {
            htmlinjection += `<div class="container-menu-time-cards hidden" id="container-${time}-cards">`;
            const timeFilteredRecords = displayFilteredRecords.filter(item => item.fields.MenuTime === time);
            const sortedRecords = timeFilteredRecords.sort((a, b) => a.fields.Order - b.fields.Order);
            sortedRecords.forEach(item => {
                const { Name, Image, OutOfStock } = item.fields;
                const Description = item.fields.Description != null ? item.fields.Description : ""
                if (item.fields.Image != null) {
                    htmlinjection += `
                    <div class="card-food" id="card-feature-food">
                        <img class="image-food" src="${Image[0].url}" alt="">
                        <div class="text-food">
                        <div class="food-name-description">
                            <h5>${Name}</h5>
                            <p>${Description}</p>
                        </div>
                `;
                } else {
                    htmlinjection += `
                   <div class="card-food" id="card-feature-food">
                    
                        <div class="text-food">
                            <div class="food-name-description">
                                <h5>${Name}</h5>
                                <p>${Description}</p>
                            </div>
                `;
                }
                container_menu_cards.innerHTML = htmlinjection;
                if (OutOfStock === true) {
                    htmlinjection += `
                        </div>
                    <h3 class="card-food-out-of-stock">Fresh out, sorry!<h3>
                    </div>
                    `}
                else {
                    htmlinjection += `
                        </div>
                    </div>
                `;
                }
            });
            htmlinjection += `
            </div> `;
        })
        document.getElementById('container-Breakfast-cards').classList.remove('hidden');
        gsap.fromTo('.card-food', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });
    }




    function displayReviewItems(items) {
        reviews_slider.innerHTML = ''; // Clear the container
        let htmlinjection = '<div id="cards-spacer-reviews"></div>';
        const filteredRecords = items.filter(item => item.fields.Display != null);
        const sortedRecords = filteredRecords.sort((a, b) => a.fields.Order - b.fields.Order);
        sortedRecords.forEach(item => {
            const { Name, Image, ReviewText, URL, Source } = item.fields;
            htmlinjection += `
                <a href="${URL}" class="card-review" target="_blank">
                    <p class="text-review">${ReviewText}</p>
                    <div class="info-review">
                        <img class="image-reviewer" src="${Image[0].url}" alt="">
                        <h5>${Name}</h5>
                        <p class="text-review-source">Review from ${Source}</p>
                    </div>
                </a>
                `;

        });
        htmlinjection += `
                <div id="cards-spacer-reviews"></div>`;
        reviews_slider.innerHTML = htmlinjection;
        gsap.fromTo('.card-review', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });
    }

    // Get the button and menu elements
    const buttons = document.querySelectorAll('.menu-btn');
    document.getElementById('breakfast-btn').classList.add('active');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove the 'active' class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            buttons.forEach(btn => btn.disabled = false);
            this.classList.add('active');
            this.disabled = true;


            // Hide all menu cards
            document.getElementById('container-Breakfast-cards').classList.add('hidden');
            document.getElementById('container-Breakfast-cards').classList.remove('visible');
            document.getElementById('container-Lunch-cards').classList.add('hidden');
            document.getElementById('container-Lunch-cards').classList.remove('visible');
            document.getElementById('container-Dinner-cards').classList.add('hidden');
            document.getElementById('container-Dinner-cards').classList.remove('visible');


            // Show the corresponding menu cards based on the button clicked
            if (this.id === 'breakfast-btn') {
                document.getElementById('container-Breakfast-cards').classList.remove('hidden');
                document.getElementById('container-Breakfast-cards').classList.add('visible');
                gsap.fromTo('#container-Breakfast-cards .card-food', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05, ease: "power1.inOut" });
            } else if (this.id === 'lunch-btn') {
                document.getElementById('container-Lunch-cards').classList.remove('hidden');
                document.getElementById('container-Lunch-cards').classList.add('visible');
                gsap.fromTo('#container-Lunch-cards .card-food', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05, ease: "power1.inOut" });
            } else if (this.id === 'dinner-btn') {
                document.getElementById('container-Dinner-cards').classList.remove('hidden');
                document.getElementById('container-Dinner-cards').classList.add('visible');
                gsap.fromTo('#container-Dinner-cards .card-food', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05, ease: "power1.inOut" });
            }
        });
    });
});