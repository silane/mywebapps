window.addEventListener('DOMContentLoaded', event => {
new Vue({
    el: '.body-content',
    data() { return {
        alerts: [],
    }},
    methods: {
        async invokeAction(actionID) {
            actionID = encodeURIComponent(actionID);
            let response;
            try {
                response = await fetch(`${ROOMAN_URL}action?id=${actionID}`);
            } catch(e) {
                this.alerts.push({type: 'danger', message: 'ネットワークエラー'});
                return;
            }
            if(!response.ok) {
                this.alerts.push({type: 'danger', message: 'サーバーがエラーを返しました'});
                return;
            }
            let responseBody;
            try {
                responseBody = await response.json();
            } catch(e) {
                this.alerts.push({type: 'danger', message: 'サーバーからの応答が無効なフォーマットです'});
                return;
            }
            if(responseBody.code !== 'success') {
                this.alerts.push({type: 'danger', message: 'サーバーがエラーを返しました'});
                return;
            }
        },
    },
});
});
