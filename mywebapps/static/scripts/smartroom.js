function afterAjaxProc(jqXHR){

	jqXHR.done(function(data,status){
		if(!data.success){
			$('#alert-area').prepend('<div class="alert alert-danger" role="alert"><button class="close" data-dismiss="alert"><span aria-hidden="true">×</span></button><strong>SmartRoomSystem Error: </strong>' + data.message + '</div>');
		}
	}).fail(function(xhr,textStatus,errorThrown){
		$('#alert-area').prepend('<div class="alert alert-danger" role="alert"><button class="close" data-dismiss="alert"><span aria-hidden="true">×</span></button><strong>Ajax Error: </strong>' + textStatus + ' ' + errorThrown + '</div>');
	});

	return jqXHR;
}

	
function setAlarmTime(jobid,timestr){
	const strs=timestr.split(':');
	let time=parseInt(strs[0])*3600+parseInt(strs[1])*60;
	if(strs.length==3)
		time+=parseInt(strs[2]);
	const data={'alarm_time':time};
	const jqXHR=$.post('setjobconfig',{'jobid':jobid,'config':JSON.stringify(data)});
	afterAjaxProc(jqXHR);
	return jqXHR.then(function(data){
		if(data.success)
			return $.Deferred().resolve().promise();
		else
			return $.Defferrd().reject().promise();
	});
}


function getAlarmTime(jobid){
	const jqXHR=$.get('getjobconfig',{'jobid':jobid});
	afterAjaxProc(jqXHR);
	return jqXHR.then(function(data){
		if(data.success){
			const time=data.value.alarm_time;
			const hour=time/3600,minute=(time/60)%60,second=time%60;
			const ret=('00'+hour).slice(-2)+':'+('00'+minute).slice(-2)+':'+('00'+second).slice(-2);
			return $.Deferred().resolve(ret);
		}else{
			return $.Deferred().reject();
		}
	});

}


$(function(){

	$('#controlpanel button[data-operationid]').click(function(eo){

		const target=$(eo.target);
		const operationid=target.attr('data-operationid');

		const jqXHR=$.post('operate',{'operationid':operationid},type='json');
		afterAjaxProc(jqXHR);
	});


	$('#jobpanel *[data-jobid] input[type="checkbox"]').change(function(eo){
		
		const target=$(eo.target);
		const jobid=target.closest('*[data-jobid]').attr('data-jobid');
		const enable=target.prop('checked');

		const jqXHR=$.post('setjobenabled',{'jobid':jobid,'enable':enable ? 1:0},type='json').done(function(data){
			if(data.success && enable && jobid=='morninglight')
				setAlarmTime(jobid,$('#alarm_time').val());
		});
		afterAjaxProc(jqXHR);
	});

	
	for(let elem of $('#jobpanel *[data-jobid]').toArray()){
		elem=$(elem)
		const jqXHR=$.get('getjobenabled',{'jobid':elem.attr('data-jobid')},type='json').done(function(data,status){
			if(data.success){
				elem.find('input[type="checkbox"]').prop('checked',data.value);

				if(data.value && elem.attr('data-jobid')=='morninglight')
					getAlarmTime('morninglight').done(function(val){
						$('#alarm_time').val(val);
					});
			}
		});
		afterAjaxProc(jqXHR);
	}
	
});
