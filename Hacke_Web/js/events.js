  
  (function(window, undefined){

  const segmentsString = 'hackeclub/events';

  const loaderName = '';
  const elementId = 'fourvenues-iframe';
  const hide = '';
  const theme = 'dark';
  const backarrow = '';
  const services = '';

  const url = 'https://www.fourvenues.com/iframe';const assets = 'https://www.fourvenues.com/assets';  
function init() {

  if (!document.getElementById(elementId)) {
    document.write('<div id="' + elementId + '"></div>');
  }

  var script = window.document.createElement("script");
  script.src = assets + '/iframe/?s=parent';
  script.type = "text/javascript";

  if (script.readyState) { //IE
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        createIframe();
      }
    };
  } else { //Others
    script.onload = function () {
      createIframe();
    };
  }

  window.document.getElementsByTagName("head")[0].appendChild(script);

}

function createIframe() {

  const element = document.getElementById(elementId);
  element.style.width = '100%';
  element.style.minHeight = '0px';
  element.style.position = 'relative';
  element.style.overflow = 'hidden';

  let queryParams = '';
  queryParams += theme ? ((queryParams ? '&' : '?') + 'theme=' + theme) : '';
  queryParams += hide ? ((queryParams ? '&' : '?') + 'hide=' + hide) : '';
  queryParams += backarrow ? ((queryParams ? '&' : '?') + 'backarrow=' + backarrow) : '';
  queryParams += services ? ((queryParams ? '&' : '?') + 'services=' + services) : '';

  const anchorElement = document.createElement('div');
  anchorElement.id = `${elementId}-anchor`;
  anchorElement.style.width = '100%';
  anchorElement.style.height = '0px';
  anchorElement.style.border = '0';
  anchorElement.style.position = 'absolute';
  anchorElement.style.top = '-100px';
  element.appendChild(anchorElement);

  let segmentsStringFromHash = '';
  if (window.location.hash) {
    const segments = (segmentsString.split('/')[0] + '/' + window.location.hash.substring(1)).split('/');
    if (segments[1].indexOf('calendar') === 0 || segments[1].indexOf('events') === 0) {
      segmentsStringFromHash = segments.join('/');
    }
  }

  const iframeElement = document.createElement('iframe');
  iframeElement.id = 'iframeFourvenues' + new Date().getTime();
  iframeElement.src = `${url}/${segmentsStringFromHash || segmentsString}${queryParams}`;
  iframeElement.width = '100%';
  iframeElement.style.minHeight = '0px';
  iframeElement.style.border = '0';
  element.appendChild(iframeElement);

  window.fourvenuesChildIframe = window.seamless(document.getElementById(iframeElement.id), {
    loading: '',
    spinner: '',
    showLoadingIndicator: false,
    fallback: false
  });

  window.fourvenuesChildIframe.receive(function (data, event) {
    processChildMessage(data);
  });

  window.addEventListener('message', async (message) => {
    const data = (message || {}).data;
    processChildMessage(data);
  }, false);

  if (document.querySelectorAll('meta[name=viewport]').length === 0) {
    const viewportElement = document.createElement('meta');
    viewportElement.name = 'viewport';
    viewportElement.content = 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, shrink-to-fit=0, viewport-fit=cover';
    document.querySelectorAll('head')[0].appendChild(viewportElement);
  } else {
    const viewportElement = document.querySelectorAll('meta[name=viewport]')[0];
    viewportElement.content = 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, shrink-to-fit=0, viewport-fit=cover';
  }

}

function processChildMessage(data) {
  if (data) {

    if (data.key === 'toTop') {
      const element = document.getElementById(`${elementId}-anchor`);
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    if (data.key === 'navigate') {
      if (data.segments) {
        const auxiliarSegments = data.segments.slice(2);
        window.location.hash = auxiliarSegments.join('/');
      }
    }

    if (data.key === 'openUrl') {
      window.location.href = data.url;
    }

    if (data.key === 'currentUrl') {
      window.fourvenuesChildIframe.send({
        key: 'currentUrl',
        url: window.location.href.toString()
      });
    }

    if (data.key === 'track') {
      window.trackingService.track(data.object, data.platforms);
    }

  }
}

if (!loaderName) {
  init();
} else {
  window[loaderName] = function () {
    init();
  }
}



class TrackingService {

  async track(object, platforms = ['fb', 'gtm', 'aw']) {
    const pixelId = object.pixelId || '';
    const gtmIds = object.gtmIds || [];
    if (object.gtmId) {
      gtmIds.push(gtmId);
    }

    delete object.pixelId;
    delete object.gtmIds;
    delete object.gtmId;

    window.googleTagManagerPreparedIds = window.googleTagManagerPreparedIds || {};
    window.googleAdsPreparedIds = window.googleAdsPreparedIds || {};

    if (pixelId && platforms.includes('fb')) {
      this.prepareFacebookPixel(0, pixelId).then(() => {
        if (window.facebookPixelPrepared) {
          const objectFB = JSON.parse(JSON.stringify(object));
          const eventName = objectFB.event || objectFB.event_name || '';
          objectFB.eventId = objectFB.event_id || '';
          objectFB.eventName = objectFB.event_name || '';
          delete objectFB.event;
          delete objectFB.eventId;
          delete objectFB.eventName;

          window.fbq('track', eventName, objectFB, { eventId: objectFB.eventId });
        }
      });
    }

    for (let i = 0; i < (gtmIds || []).length; i++) {
      object.event = object.event || object.event_name || '';
      if (gtmIds[i] && (gtmIds[i].indexOf('AW') === 0 && platforms.includes('aw'))) {
        const dataLayerName = 'dataLayer_aw_' + gtmIds[i].replace('-', '_');
        await this.prepareGoogleAds(0, gtmIds[i], window, document, 'script', dataLayerName);
        if (object.event) {
          this.sendGoogleAds(gtmIds[i], window, document, 'script', dataLayerName, object);
        }
      } else if (gtmIds[i] && (gtmIds[i].indexOf('GTM') === 0 && platforms.includes('gtm'))) {
        const dataLayerName = 'dataLayer_gtm_' + gtmIds[i].replace('-', '_');
        await this.prepareGoogleTagManager(0, gtmIds[i], window, document, 'script', dataLayerName);
        if (object.event) {
          this.sendGoogleTagManager(gtmIds[i], window, document, 'script', dataLayerName, object);
        }
      } else if (gtmIds[i]) {
        const dataLayerName = 'dataLayer_ga4_' + gtmIds[i].replace('-', '_');
        await this.prepareGoogleAds(0, gtmIds[i], window, document, 'script', dataLayerName);
        if (object.event) {
          this.sendGoogleTagManager(gtmIds[i], window, document, 'script', dataLayerName, object);
        }
      }
    }

  }

  prepareFacebookPixel(times = 0, pixelId, f = window, b = document, e = 'script', v = 'https://connect.facebook.net/en_US/fbevents.js', n, t, s) {
    return new Promise((resolve) => {
      if (window.facebookPixelPrepared) {
        resolve(true);
        return;
      }
      if (window.facebookPixelPreparing) {
        setTimeout(async () => {
          if (times > 10) {
            return resolve(false);
          }
          resolve(await this.prepareFacebookPixel(times++, pixelId, f, b, e, v, n, t, s));
        }, 300);
        return;
      }
      window.facebookPixelPreparing = true;

      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
      t.onload = () => {

        f.fbq('init', pixelId);

        delete window.facebookPixelPreparing;
        window.facebookPixelPrepared = true;

        resolve(true);
      }
    });
  }

  prepareGoogleTagManager(times = 0, i, w = window, d = document, s = 'script', l = 'dataLayer') {
        return new Promise((resolve) => {
      window.googleTagManagerPreparedIds = window.googleTagManagerPreparedIds || {};
      window.googleTagManagerPreparingIds = window.googleTagManagerPreparingIds || {};
      if (window.googleTagManagerPreparedIds[i]) {
        resolve(true);
        return;
      }
      if (window.googleTagManagerPreparingIds[i]) {
        setTimeout(async () => {
          if (times > 10) {
            return resolve(false);
          }
          resolve(await this.prepareGoogleTagManager(times++, i, w, d, s, l));
        }, 300);
        return;
      }
      window.googleTagManagerPreparingIds[i] = true;

      w[l] = w[l] || [];
      w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src =
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
      j.onload = () => {

        delete window.googleTagManagerPreparingIds[i];
        window.googleTagManagerPreparedIds[i] = true;

                resolve(true);
      }
    });
  }

  prepareGoogleAds(times = 0, i, w = window, d = document, s = 'script', l = 'dataLayer') {
    return new Promise((resolve) => {
      window.googleAdsPreparedIds = window.googleAdsPreparedIds || {};
      window.googleAdsPreparingIds = window.googleAdsPreparingIds || {};
      if (window.googleAdsPreparedIds[i]) {
        resolve(true);
        return;
      }
      if (window.googleAdsPreparingIds[i]) {
        setTimeout(async () => {
          if (times > 10) {
            return resolve(false);
          }
          resolve(await this.prepareGoogleAds(times++, i, w, d, s, l));
        }, 300);
        return;
      }
      window.googleAdsPreparingIds[i] = true;

      w[l] = w[l] || [];
      w[l].push(['js', new Date()]);
      w[l].push(['config', i, {
        cookie_flags: 'max-age=7200;secure;samesite=none'
      }]);

      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src =
        'https://www.googletagmanager.com/gtag/js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
      j.onload = () => {

        delete window.googleAdsPreparingIds[i];
        window.googleAdsPreparedIds[i] = true;

        resolve(true);
      }
    });
  }

  gtag() {
    window.dataLayer.push(arguments);
  }

  sendGoogleTagManager(i, w = window, d = document, s = 'script', l = 'dataLayer', object = {}) {
    w[l] = w[l] || [];
    object.event = object.event || object.event_name;
    w[l].push(object);
      }

  sendGoogleAds(i, w = window, d = document, s = 'script', l = 'dataLayer', object = {}) {
    const objectAds = {
      send_to: object.send_to,
      value: object.value,
      currency: object.currency,
      transaction_id: object.transaction_id || ''
    }
    w[l] = w[l] || [];
    w[l].push(['event', object.event || object.event_name, objectAds]);
  }

}

window.trackingService = new TrackingService();

  }(window))


