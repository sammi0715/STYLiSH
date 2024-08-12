let currentPage = 0;
let isFetching = false;

const fetchWithTimeout = (url, timeout = 3000) => {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('連線逾時')), timeout)
        )
    ]);
};
document.addEventListener('DOMContentLoaded', function () {
    const updateCartCount = () => {
        const savedCart = localStorage.getItem('cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountSpan = document.querySelectorAll(".cart-count");
        cartCountSpan.forEach(cartCountSpan => {
            cartCountSpan.textContent = totalQuantity;
        });
    };
    updateCartCount();



    //campaigns//

    const carousel = document.getElementById('carousel');
    const dotsContainer = document.getElementById('carousel-dots');
    const bannerText = document.getElementById('banner-text');
    const bannerTitle = document.getElementById('banner-title');
    let index = 0;
    let campaigns = [];

    fetchWithTimeout('https://api.appworks-school.tw/api/1.0/marketing/campaigns')
        .then(response => response.json())
        .then(data => {
            campaigns = data.data;



            campaigns.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === index) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    index = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
            updateCarousel();

            setInterval(() => {
                index = (index < campaigns.length - 1) ? index + 1 : 0;
                updateCarousel();
            }, 3000);
        })

        .catch(error => console.error('Error fetching campaigns:', error));

    function updateCarousel() {
        const campaign = campaigns[index];
        carousel.style.backgroundImage = `url(${campaign.picture})`;
        carousel.style.cursor = "pointer";

        carousel.onclick = (e) => {

            if (!e.target.classList.contains('dot')) {
                window.location.href = `/product?id=${campaign.product_id}`;
            }
        };
        const lastIndex = campaign.story.lastIndexOf('\r\n');
        const mainStory = campaign.story.slice(0, lastIndex);
        const highlight = campaign.story.slice(lastIndex);
        bannerText.textContent = `${mainStory}`;
        bannerTitle.textContent = `${highlight}`;

        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
});



//search 功能//
const searchInput = document.getElementById('search-input');
const searchIconSpan = document.getElementById('search-icon-span');
const searchContainer = document.getElementById('search-container');

searchIconSpan.addEventListener('click', () => {
    searchContainer.classList.toggle('show');
    searchInput.focus();
});

const handleSearch = (event) => {
    if (event.key === 'Enter') {
        const search = searchInput.value.trim();
        const apiUrl = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${encodeURIComponent(search)}`;
        updateUrl('search', search);
        fetchAndDisplayProducts(apiUrl, true);
    }
};
searchInput.addEventListener('keypress', handleSearch);

const fetchAndDisplayProducts = (apiUrl, reset = false) => {
    if (isFetching) return;
    isFetching = true;

    const loadingElement = document.getElementById('loading');
    const skeletonScreen = document.querySelector('.skeleton-screen');
    loadingElement.classList.add('show');
    skeletonScreen.style.display = 'flex';

    fetchWithTimeout(apiUrl)
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(".product-list");


            if (reset) {
                container.innerHTML = '';
                currentPage = 0;
            }

            const previousNotMatchText = document.querySelector('.not-match-text');
            if (previousNotMatchText) {
                previousNotMatchText.remove();
            }

            const products = data.data;
            if (products.length === 0 && reset) {
                container.insertAdjacentHTML('beforebegin', `<h1 class="not-match-text">找不到符合商品。</h1>`);
            } else {
                products.forEach(product => {
                    const productListHTML = `
                    <div class="product-box">
                    <a href="/product?id=${product.id}" class="product-link">
                        <img src="${product.main_image}" alt="${product.title}" class="product-img">
                        <span class="cube-box">
                            ${product.colors.map(color => `<div class="color-cube" style="background-color: #${color.code};"></div>`).join('')}
                        </span>
                        <h2 class="product-title">${product.title}</h2>
                        <span class="price">TWD.${product.price}</span>
                        </a>
                    </div>
                `;
                    container.insertAdjacentHTML('beforeend', productListHTML);
                });
            }

            if (data.next_paging !== undefined) {
                currentPage = data.next_paging;
            } else {
                currentPage = null;
            }
        })

        .catch(error => {
            alert('網路中断，請檢查您的網路連線或連線逾時。');
            console.error('Error fetching data:', error);
        })
        .finally(() => {
            isFetching = false;
            loadingElement.classList.remove('show');
            skeletonScreen.style.display = 'none';
        });
};

const getApiUrlFromCategory = (category, currentPage = 0) => {
    const baseApiUrl = 'https://api.appworks-school.tw/api/1.0/products/';
    return `${baseApiUrl}${category}?paging=${currentPage}`;
};
//分類//
const getCategoryFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'all';
};
//搜尋keyword//
const getSearchFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('keyword') || '';
}
const updateUrl = (category, search = '') => {
    const url = new URL(window.location);
    url.searchParams.set('category', category);
    if (search) {
        url.searchParams.set('keyword', search);
    } else {
        url.searchParams.delete('keyword');
    }
    window.history.pushState({}, '', url);
};

const updateSelectedNav = (category) => {
    document.querySelectorAll('.navbar a').forEach(button => {
        if (button.getAttribute('data-category') === category) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
};

const handleNavClick = (event) => {
    event.preventDefault();
    const category = event.currentTarget.getAttribute('data-category');
    const search = getSearchFromUrl();
    const apiUrl = search ? `https://api.appworks-school.tw/api/1.0/products/search?keyword=${encodeURIComponent(search)}` : getApiUrlFromCategory(category);
    updateUrl(category, search);
    fetchAndDisplayProducts(apiUrl, true);
    updateSelectedNav(category);
    currentPage = 0;
};

document.querySelectorAll('.navbar a').forEach(button => {
    button.addEventListener('click', handleNavClick);
});

document.querySelector('#logo').addEventListener('click', (event) => {
    event.preventDefault();
    const category = 'all';
    const apiUrl = getApiUrlFromCategory(category);
    fetchAndDisplayProducts(apiUrl, true);
    updateUrl(category);
    updateSelectedNav(category);
    currentPage = 0;
});

const initialCategory = getCategoryFromUrl();
const initialSearch = getSearchFromUrl();
const initialApiUrl = initialSearch ? `https://api.appworks-school.tw/api/1.0/products/search?keyword=${encodeURIComponent(initialSearch)}` : getApiUrlFromCategory(initialCategory, 0);
fetchAndDisplayProducts(initialApiUrl, true);
updateSelectedNav(initialCategory);

window.addEventListener('popstate', () => {
    const category = getCategoryFromUrl();
    const search = getSearchFromUrl();
    const apiUrl = search ? `https://api.appworks-school.tw/api/1.0/products/search?keyword=${encodeURIComponent(search)}` : getApiUrlFromCategory(category, 0);
    fetchAndDisplayProducts(apiUrl, true);
    updateSelectedNav(category);
    currentPage = 0;
});

function isScrollToBottom() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    return scrollTop + clientHeight >= scrollHeight - 100;
}

window.addEventListener('scroll', () => {
    if (isScrollToBottom() && currentPage !== null && !isFetching) {
        const category = getCategoryFromUrl();
        const search = getSearchFromUrl();
        const apiUrl = search ? `https://api.appworks-school.tw/api/1.0/products/search?keyword=${encodeURIComponent(search)}&paging=${currentPage}` : getApiUrlFromCategory(category, currentPage);
        fetchAndDisplayProducts(apiUrl);
    }
});
