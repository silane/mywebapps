window.addEventListener('DOMContentLoaded', event => {
new Vue({
    el: '.body-content',
    data() { return {
        jobs: [],
        alerts: [],
        newAlarmTime: '',
    }},
    computed: {
        cmp() { return datetime.cmp; },
    },
    async created() {
        await this.reloadJobList();
    },
    methods: {
        async $__requestRooman(method, path, body) {
            let response;
            body = method === 'HEAD' || method === 'GET' ?
                undefined : JSON.stringify(body);
            try {
                response = await fetch(`${ROOMAN_URL}${path}`, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'},
                    body: body,
                });
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
            return responseBody.payload;
        },
        async invokeAction(actionID, parameters) {
            return await this.$__requestRooman('POST', 'action', {
                id: actionID, parameters: parameters,
            });
        },
        async newJob(jobTypeID, parameters) {
            await this.$__requestRooman('POST', 'newjob', {
                type_id: jobTypeID, parameters: parameters,
            });
        },
        async deleteJob(jobID, parameters) {
            await this.$__requestRooman('POST', 'deletejob', {
                id: jobID, parameters: parameters,
            });
        },
        async invokeJobAction(jobID, parameters) {
            return await this.$__requestRooman('POST', 'jobaction', {
                id: jobID, parameters: parameters,
            });
        },
        async reloadJobList() {
            const jobList = await this.$__requestRooman('GET', 'listjob', {
                type_id: null,
            });
            this.jobs = await Promise.all(jobList.map(async x => {
                const jobID = x.job_id, jobTypeID = x.job_type_id;
                const ret = {jobID, jobTypeID, state: null, error: null};
                switch(jobTypeID) {
                    case 'alarm':
                        const state = await this.invokeJobAction(jobID);
                        if(state == null) {
                            ret.error = 'error_code';
                        } else {
                            let time = state.time;
                            time = new datetime.Time(Math.floor(time / 3600),
                                                     Math.floor(time / 60) % 60,
                                                     time % 60);
                            ret.state = {time};
                        }
                        break;
                }
                return ret;
            }));
        },
        async newAlarm() {
            let time = this.newAlarmTime;
            if(!time) return;
            time = time.split(':');
            if(time.length === 2) time.push('0');
            time = parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 +
                   parseInt(time[2]);
            await this.newJob('alarm', {time: time});
        },
    },
});
});
