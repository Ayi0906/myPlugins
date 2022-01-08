;(function (w) {
    function sendAjax(optionObj) {
        let {
            method,
            url,
            data,
            success,
            error
        } = optionObj

        method = method ? method : 'get'


        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {

                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    ;
                    (typeof success == 'function') && success(xhr.responseText)
                } else {
                    ;
                    (typeof error == 'function') && error(xhr.responseText)
                }
            }
        }

        if (method.toUpperCase() === 'GET') {
            let getUrl = addURLParam({method, url, data})
            xhr.open(method, getUrl, true)
            xhr.send(null)
        } else if (method.toUpperCase() === 'POST') {
            let postStr = addURLParam({method, data})
            xhr.open(method, url, true)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            xhr.send(postStr)
        }

        function addURLParam(options) {
            let {method, url, data} = options

            if (method.toUpperCase() === 'GET') {
                for (const prop in data) {
                    url += (url.indexOf('?') === -1 ? '?' : '&')
                    url += encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop])
                }
                return url
            } else if (method.toUpperCase() === 'POST') {
                let str = ''
                for (const prop in data) {
                    str += encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]) + '&'
                }
                str = str.slice(0, str.length - 1)
                return str
            }
        }
    }

    w.sendAjax = sendAjax
})(window)