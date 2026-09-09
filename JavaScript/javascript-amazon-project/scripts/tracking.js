import { getOrder } from '../data/orders.js';
import { getProduct, loadProductsFetch } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId);
  const product = getProduct(productId);

  if (!order || !product) {
    document.querySelector('.js-order-tracking').innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
      <div class="delivery-date">
        We could not find this order.
      </div>
    `;
    return;
  }

  // Get additional details about the product like
  // the estimated delivery time.
  const productDetails = order.products.find((details) => {
    return details.productId === product.id;
  });

  if (!productDetails) {
    document.querySelector('.js-order-tracking').innerHTML = `
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>
      <div class="delivery-date">
        This product is not part of the selected order.
      </div>
    `;
    return;
  }

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress = Math.min(100, Math.max(0,
    ((today - orderTime) / (deliveryTime - orderTime)) * 100
  ));
  const deliveredMessage = percentProgress >= 100 ? 'Delivered on:' : 'Arriving on:';
  

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      ${deliveredMessage} ${dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D')
    }
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label ${percentProgress < 50 ? 'current-status' : ''
    }">
        Preparing
      </div>
 <div class="progress-label ${(percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''
    }">
        Shipped
      </div>
      <div class="progress-label ${percentProgress >= 100 ? "current-status" : ''
    }">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
}

loadPage();