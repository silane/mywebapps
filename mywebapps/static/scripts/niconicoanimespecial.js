const vm = new Vue({
  el: '.body-content',
  data: { alerts: [], programs: [] },
  methods: {
    reload: function () {
      const reloadicon = $(".reloadicon");
      if (reloadicon.hasClass("active"))
        return;
      reloadicon.addClass("active");

      function fn_finally() {
        reloadicon.removeClass("active");
      }
          
      fetch('get').then(response => {
        if (response.ok)
          response.json().then(resp => {
            for(program of resp)
              program.startTime = new Date(program.startTime);
            this.programs = resp;
          }, error => {
            this.alerts.unshift({
              type: 'danger',
              message: `Server returned invalid response: ${error}`,
            });
          });
        else
          this.alerts.unshift({
            type: 'danger',
            message: `Server returned status code ${response.status}`,
          });
        }, error => {
          this.alerts.unshift({
            type: 'danger',
            message: `Could not get response from server: ${error}`,
          });
        }).then(fn_finally, fn_finally);        
    },
  },
});

vm.reload();
