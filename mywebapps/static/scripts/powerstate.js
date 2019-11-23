const vm = new Vue({
    el: '.body-content',
    data: { alerts: [], machines: [], requests: [],
            autoreloadingEnabled: false, reloading: false },
    watch: {
        autoreloadingEnabled(val, oldVal) {
            if(val && !oldVal) {
                const loop = () => {
                    if(!this.autoreloadingEnabled)
                        return
                    this.reload()
                    setTimeout(loop, 10000)
                }
                loop()
            }
        }
    },
    methods: {
        reload: async function () {
            if(this.reloading)
                return;
            this.reloading = true;
            let data = null;
            try {
                const response = await fetch('getmachines');
                if(response.ok)
                    data = await response.json();
                else
                    this.alerts.unshift({
                        type: 'danger',
                        message: `Error reloading machine list: Server retured status code ${response.status}`
                    });
            } catch(e) {
                this.alerts.unshift({type: 'danger', message: `Error reloading machine list: ${e}`});
            } finally {
                this.reloading = false;
            }
            if(data !== null) {
                this.machines = data;
                this.$nextTick(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                });
            }
        },
        change_powerstate: function (state, target) {
            const formData = new FormData();
            formData.append('state', state);
            switch (state) {
                case 'wake':
                    formData.append('mac', target.mac);
                    break;
                case 'sleep':
                case 'suspend':
                case 'shutdown':
                    formData.append('ip', target.ip);
                    break;
            }

            const pushRequestingEntry = (name, state) => {
                this.requests.push({name, state});
            }
            const findRequestingEntry = (name, state) => {
                return this.requests.findIndex(val => val.name == name && val.state == state);
            }
            const removeRequestingEntry = (name, state) => {
                const idx = findRequestingEntry(name, state);
                if(idx == -1) return;
                this.requests.splice(idx, 1);
            }

            if(findRequestingEntry(target.name, state) != -1)
                return;
            pushRequestingEntry(target.name, state)

            fetch('changepowerstate', { 'method': 'POST', 'body': formData }).then(response => {
                if (response.ok)
                    return response.json().then(data => {
                        if(data.success)
                            vm.alerts.unshift({ type: 'success', message: `${target.name}に${state}を要求しました` });
                        else
                            this.alerts.unshift({type: 'danger', message: `${target.name}への${state}要求でサーバーからエラーが返されました: ${data.message}`});
                    });
                else
                    vm.alerts.unshift({ type: 'danger', message: `${target.name}への${state}要求でサーバーからエラーが返されました: ${response.status}` });
            }).catch(e => {
                vm.alerts.unshift({ type: 'danger', message: `${e}` });
            }).then(() => {
                removeRequestingEntry(target.name, state);
            });
        }
    },
});

vm.reload();
