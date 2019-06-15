// search
$.fn.uiSearch = function(){
	var ui = $(this);
	$('.ui-search-selected',ui).on('click',function(){
		$('.ui-search-select-list').show();
		return false;
	});
	$('.ui-search-select-list a',ui).on('click',function(){
		$('.ui-search-selected',ui).text($(this).text());
		$('.ui-search-select-list',ui).hide();
		return false;
	});
	$('body').on('click',function(){
		$('.ui-search-select-list').hide();
	});
	$('.ui-search-select-list').hide();
};


// Tab switching

$.fn.uiTab  = function(tabs,cons,focus_prefix){

	var ui = $(this);
	var tabs = $(tabs,ui);
	var cons = $(cons,ui);
	var focus_prefix = focus_prefix || '';


	tabs.on('click',function(){
		var index = $(this).index();
		
		tabs.removeClass(focus_prefix+'item_focus').eq(index).addClass(focus_prefix+"item_focus");
		cons.hide().eq(index).show();
		return false;
	});


};


// Slide switch
/*


According to the existing DOM structure

.ui-slider <----- outermost frame
.ui-slider-wrap <----- content framework
.item <----- Every content
.ui-slider-arrow <----- Control arrow
.item.left
.item.right
.ui-slider-process <----- One-to-one correspondence with content
.item


*/
$.fn.uiSlider  =function(){
	var wrap =  $('.ui-slider-wrap',this);
	var size = $('.item',wrap).size()-1;
	

	var goPrev = $('.ui-slider-arrow .left',this);
	var goNext = $('.ui-slider-arrow .right',this);

	var items = $('.item',wrap);
	var tips  = $('.ui-slider-process .item',this);
	var width =  items.eq(0).width();

	var currentIndex = 0;
	var autoMove = true;

	//	1.Basic event
	wrap
	.on('resetFocus',function(evt,isAutoMove){

		// if(autoMove === true &&)

		tips.removeClass('item_focus').eq(currentIndex).addClass('item_focus');
		wrap.animate({left:currentIndex*width*-1});
	})
	.on('nextFocus',function(){

		currentIndex = currentIndex+1 > size ? 0 : currentIndex+1;
		$(this).triggerHandler('resetFocus');

		// 4. Chained call
		return $(this);

	})
	.on('prevFocus',function(){
		currentIndex = currentIndex-1 < 0 ? size : currentIndex-1;
		$(this).triggerHandler('resetFocus');

	})
	.on('autoMove',function(){
		// 2. Automatic processing
		if(autoMove == true){
			setTimeout(function(){
				// 3. Closure && chain call
				wrap.triggerHandler('nextFocus').triggerHandler('autoMove');
			},5000);
		}
	}).triggerHandler('autoMove');


	goPrev.on('click',function(){
		wrap.triggerHandler('prevFocus');
		return false;
	});
	goNext.on('click',function(){
		wrap.triggerHandler('nextFocus');
		return false;
	});

	//	5.Task BUG Exclusion (Timer BUG)

}


//	Get data from a remote location (usually in the background)
var getData = function(k,v){

	//	Initialize all urban areas
	if( k === undefined){
		return [{id:1,name:'东城区'},{id:2,name:'西城区'}];
	}
	//	According to the city, the following level is obtained (the id of the same level in different urban areas is different)
	if( k === 'area' ){
		var levelData = {
			1:[  {id:11,name:'一级医院'},{ id:12,name:'二级医院'} ],
			2:[  {id:22,name:'二级医院'} ]
		}
		return levelData[v] || [];
	}
	//	Get hospitals according to grade
	if( k === 'level'){
		var hospital = {
			11 : [  {id:1,name:'A1医院'},{id:2,name:'A2医院'} ],
			12 : [  {id:3,name:'B1医院'} ],
			22 : [  {id:4,name:'C1医院'},{id:5,name:'C2医院'} ]

		}

		return hospital[v] || [];

	}
	//	Access to the department by name (the departments are attached to the hospital)
	if( k === 'name'){
		var department = {
			1 : [  {id:1,name:'骨科'},{id:2,name:'内科'} ],
			2 : [  {id:3,name:'儿科'} ],
			3 : [  {id:4,name:'骨科'},{id:5,name:'内科'} ],
			4 : [  {id:6,name:'儿科'} ],
			5 : [  {id:7,name:'骨科'},{id:8,name:'内科'} ]

		}

		return department[v] || [];
	}
	return [];
}




$.fn.uiCascading = function(){

	
// Each select is updated, all subsequent selects are cleaned up.
// and get the next select data based on the current select value, and update
	var ui = $(this);
	var listSelect = $('select',this);


	//	Each select
	listSelect

		.on('updateOptions',function(evt,ajax){
			
			var select = $(this);

			select.find('option[value!=-1]').remove();
			if(ajax.data.length<1){
				return true;
			}
			for(var i=0,j=ajax.data.length;i<j;i++){
				var k = ajax.data[i].id;
				var v = ajax.data[i].name;
				select.append( $('<option>').attr('value',k).text(v) );
			}
			return true;
		})
		.on('change',function(){

			var changeIndex = listSelect.index(this);

			var k = $(this).attr('name');
			var v = $(this).val();

			var data  = getData(k,v);

			listSelect.eq(changeIndex+1).triggerHandler('updateOptions',{ data:data });
			
			ui.find('select:gt('+(changeIndex+1)+')').each(function(){
				$(this).triggerHandler('updateOptions',{ data:[] });	
			})
		})


		//	initialization
		listSelect.find('option:first').attr('value','-1');	//	Special initial value tag

		listSelect.eq(0).triggerHandler('updateOptions',{ data:getData() }); // Apply pass


}


$(function () {

	$('.ui-search').uiSearch();

	$('.content-tab').uiTab('.caption > .item ' , '.block > .item');
	$('.content-tab .block .item').uiTab('.block-caption > a ' , '.block-wrap','block-capiton-');

	$(window).on('scroll',function(){
		if( $('body').scrollTop() > $(window).height() ){
			$('.go-top').show();
		}else{
			$('.go-top').hide();
		}
	});

	$('.ui-slider').uiSlider();

	$('.ui-cascading').uiCascading();
})