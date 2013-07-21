/*
 *  Project: advancedTable
 *  Description: Table handling
 *  Author: Tóth András
 *  Web: http://atandrastoth.co.uk/webdesign
 *  email: atandrastoth.gmail.com
 *  License: MIT
 *  version: 1.1.0
 */
;
(function($, window, document, undefined) {
	var upRows = [];
	var isSafari = navigator.userAgent.toLowerCase().indexOf("safari") != -1;
	var isIe = navigator.userAgent.toLowerCase().indexOf("msie") != -1;
	var isFireFox = navigator.userAgent.toLowerCase().indexOf("firefox") != -1;
	var hasTouch = /android|iphone|ipad/i.test(navigator.userAgent.toLowerCase()),
		eventName = hasTouch ? 'touchend' : 'click';

	var pluginName = "advTable",
		defaults = {
			src: 'database',
			name: "advTable",
			width: 1000,
			height: 300,
			delimiter: ';',
			datePicker: true,
			buttons: {
				addRow: true,
				dellRow: true,
				update: true,
				reload: true,
				search: true
			},
			php: {
				id: 0,
				file: "com.php",
				user: "root",
				timeout: 60000
			}
		};

	function Plugin(element, options) {
		this.element = element;

		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype = {

		init: function() {
			var sTable = $(this.element);
			sTable.attr('tabindex', 0);
			if (sTable.children().length == 0 && this.options.src == 'database') {
				var ops = this.options;
				var data = sTable.advTable.ajaxcall(ops.php.file, ops.name, ops.php.id, 'load', ops.php.user, '');
				var tbl = load(data, ops);
				var th = $(tbl.th);
				var tb = $(tbl.tb);
				sTable.append(th).append(tb);
			} else if (sTable.children().length == 0 && this.options.src != 'database') {
				var ops = this.options;
				var data = sTable.advTable.ajaxcall(ops.php.file, ops.name, ops.php.id, 'load_excel', ops.src, ops.delimiter);
				sTable.html(data);
			}
			var tStr = '<div class="outertbl" tabindex="0"><div class="tblwrp"><div class="hdwrp" style="width: 983px;"></div>';
			tStr += '\t\t<div class="bdwrp">';
			tStr += '\t\t\t<img src="css/img/resize.png" class="resize"><img src="css/img/down.png" class="down" title = "down">';
			tStr += '\t\t\t<img src="css/img/up.png" class="up" title = "up"><img src="css/img/option.png" class="option" title = "console">';
			tStr += '\t\t\t<a href = "upload/' + this.options.name + '.csv" class="download" title = "download"><img style = "height: 100%;" src="css/img/download.png" ></a>';
			tStr += "\t\t</div>";
			tStr += "\t</div>";
			tStr += '\t<div class="consol" >';
			tStr += '\t\t<a style="font-weight: bold;">advTable</a><br><br>';
			tStr += '\t\t<input type="button" class="cButton" value="reload">';
			tStr += '\t\t<input type="button" class="cButton" value="update">';
			tStr += '\t\t<input type="button" class="cButton" value="add row">';
			tStr += '\t\t<input type="button" class="cButton" value="del row">';
			tStr += '\t\t<a>Search : </a><input type="text" class="cInput" tabindex="1"><br>';
			tStr += "\t\t<a>Total rows - Filtered rows: 0 - 0</a>";
			tStr += '\t\t<div class = "loaderDiv"><a></a><div class = "bar"></div></div>';
			tStr += "\t</div>";
			tStr += "</div>";
			var head = sTable.children('thead');
			var body = sTable.children('tbody');
			var divWidth = [];
			var hTable = $('<table class = "tbldef"><thead><tr></tr></thead></table>');
			var outertbl = $(tStr);
			var tblwrp = outertbl.find('.tblwrp');
			var hdwrp = outertbl.find('.hdwrp');
			var bdwrp = outertbl.find('.bdwrp');
			var resize = outertbl.find('.resize');
			var option = outertbl.find('.option');
			var down = outertbl.find('.down');
			var download = outertbl.find('.download');
			var up = outertbl.find('.up');
			var consol = outertbl.find('.consol');
			var reload = consol.children('input').eq(0);
			this.options.buttons.reload == true ? null : reload.css('display', 'none');
			var update = consol.children('input').eq(1);
			this.options.buttons.update == true ? null : update.css('display', 'none');
			var addRow = consol.children('input').eq(2);
			this.options.buttons.addRow == true ? null : addRow.css('display', 'none');
			var dellRow = consol.children('input').eq(3);
			this.options.buttons.dellRow == true ? null : dellRow.css('display', 'none');
			var search = consol.children('input').eq(4);
			this.options.buttons.search == true ? null : search.css('display', 'none');
			var rlog = consol.children('a').eq(2);
			consol.children('a').eq(0).html(this.options.name);
			var passWord = '';
			var deleteRowsIds = [];
			var bar = outertbl.find('.bar');
			bar.per = function() {
				return this.parent().width() / this.co;
			};
			bar.co = 0;
			bar.act = 0;
			bar.set = function() {
				this.act += this.per();
				this.width(this.act);
				this.parent().children('a').html((this.act / this.parent().width() * 100).toFixed(2) + ' %');
				return (this.act / this.parent().width() * 100);
			};
			bdwrp.height(this.options.height);
			tblwrp.width(this.options.width);
			outertbl.insertBefore(sTable);
			sTable.appendTo(bdwrp).addClass('tbldef');

			$.each(head.children('tr').eq(0).children('th'), function(cell) {
				divWidth.push($(this).outerWidth(true));
				th = $('<th>')
				th.html('<div style = "min-width:' + divWidth[cell] + 'px;">' + $(this).html() + '</div>');
				hTable.children('thead').children('tr').append(th);
				$(this).html('<div style = "min-width:' + divWidth[cell] + 'px;"></div>');
			});

			tblwrp.css('max-width', sTable.outerWidth(true) + getScrollWidth());

			hdwrp.append(hTable);

			hdwrp.width(bdwrp.width() - getScrollWidth());
			outertbl.data().resize = {};
			outertbl.data().resize.state = false;
			outertbl.data().resize.x = 0;
			outertbl.data().resize.y = 0;

			sTable.css({
				top: -sTable.children('thead').outerHeight(true)
			});

			bdwrp.on({
				scroll: function() {
					var leftScroll = bdwrp.scrollLeft();
					hdwrp.scrollLeft(leftScroll);
					var h = 0;
					(isIe || isFireFox) ? h = bdwrp[0].scrollHeight : h = bdwrp[0].scrollHeight - bdwrp.height();
					if (bdwrp.scrollTop() > h) {
						bdwrp.scrollTop(h)
					}
				}
			});
			update.on('click', function() {
				var op = sTable.data().plugin_advTable.options;
				if (passWord == '') {
					passWord = prompt('Please give your password ...');
					setTimeout(function() {
						passWord = '';
					}, sTable.data().plugin_advTable.options.php.timeout);
					var state = $.fn.advTable.ajaxcall(op.php.file, op.name, op.php.id, 'getpass', false, passWord);
					if (state.state != 'OK') {
						passWord = '';
						alert('Error: Wrong Password!');
						return;
					}
				}
				if (passWord == '') {
					return
				}
				bar.width(0);

				var up = sTable.find('.updated');
				var ne = sTable.find('.newRow');
				var de = deleteRowsIds.toString();
				de = de.split(',');
				bar.co = up.length + de.length + ne.length;
				bar.width(0);
				bar.act = 0;
				$.each(de, function(ind) {
					upRow = de[ind];
					var state = $.fn.advTable.ajaxcall(op.php.file, op.name, op.php.id, 'delete', upRow, passWord, true, bar);
					deleteRowsIds.shift(1);
				})
				$.each(ne, function(ind) {
					upRow = makeData(ne.eq(ind));
					var state = $.fn.advTable.ajaxcall(op.php.file, op.name, op.php.id, 'insert', upRow, passWord, true, bar);
					ne.eq(ind).removeClass();
				})
				$.each(up, function(ind) {
					upRow = makeData(up.eq(ind));
					var state = $.fn.advTable.ajaxcall(op.php.file, op.name, op.php.id, 'update', upRow, passWord, true, bar);
					up.eq(ind).removeClass();
				})
			});

			search.click(function() {
				search.focus();
			});
			option.on('click', function() {
				if (consol.css('display') == 'block') {
					consol.fadeOut(200)
				} else {
					consol.fadeIn(200, function() {
						textSearch();
					});
				}
			});

			down.on('click', function() {
				var h = 0;
				isIe ? h = bdwrp[0].scrollHeight : h = bdwrp[0].scrollHeight - bdwrp.height();
				bdwrp.animate({
					scrollTop: h
				}, 'swing')
			});

			up.on('click', function() {
				bdwrp.animate({
					scrollTop: 0
				}, 'swing')
			});
			sTable.on({
				dblclick: function() {
					var ops = sTable.data().plugin_advTable.options;
					if ($(this).index() == ops.php.id || $(this).html().indexOf('<input') != -1) {
						return
					}
					$(this).css({
						'padding': 0,
						'margin': 0
					});
					var tLen = 1;
					var d = 'text';
					var inner = $(this).html();
					if ((ops.datePicker) && isDate($(this).html())) {
						$(this).html().length > 10 ? d = 'datetime-local' : d = 'date';
						inner = $(this).html().replace(' ', 'T')
					};
					$(this).html().length == 0 ? tLen = 1 : tLen = $(this).html().length;
					var ow = 0;
					var uh = 0;
					(isIe || isFireFox) ? ow = $(this).outerWidth(true) - 8 : ow = $(this).outerWidth(true) - 4;
					(isIe || isFireFox) ? oh = $(this).outerHeight(true) - 8 : oh = $(this).outerHeight(true) - 4;
					$(this).html('<input tabindex="1" size = "' + tLen + '" type ="' + d + '" value = "' + inner + '" style = "width:' + ow + 'px;height:' + oh + 'px" >');
					$(this).children('input').focus();
				}
			}, 'td');
			sTable.on({
				focusout: function() {
					var obj = $(this).parent('td');
					var v = $(this).val();
					isDate(v.replace('T', ' ')) ? v = v.replace('T', ' ') : v;
					$(this).attr('tabindex', -1);
					obj.attr('style', '');
					obj.parent('tr').addClass('updated');
					obj.html(v);
					colCheck(obj);
				}
			}, 'input');

			sTable.on({
				click: function(event) {
					if (!event.ctrlKey) {
						sTable.children('tbody').children('tr').removeClass('sel');
					}
					if (typeof $(this).attr('class') == 'undefined' || $(this).attr('class').indexOf('sel') == -1) {
						$(this).addClass('sel');
					} else {
						$(this).removeClass('sel');
					}
				}
			}, 'tr');
			dellRow.on('click', function() {
				var dells = sTable.find('.sel');
				$.each(dells, function(index) {
					deleteRowsIds.push(dells.eq(index).children('td').eq(sTable.data().plugin_advTable.options.php.id).html());
				});
				sTable.find('.sel').animate({
					'line-height': 0,
					height: 0
				}, 'swing', function() {
					$(this).remove()
				});
			});
			outertbl.on({
				mousedown: function(event) {
					event.preventDefault();
					(isFireFox || isIe) ? sTable.css('display', 'none') : null;
					outertbl.data().resize.state = true;
					outertbl.data().resize.x = event.offsetX || event.originalEvent.layerX;
					outertbl.data().resize.y = event.offsetY || event.originalEvent.layerY;
				}
			}, '.resize');
			outertbl.parent().on({
				mousemove: function(event) {
					event.preventDefault();
					var dat = outertbl.data().resize;
					if (dat.state == true) {
						tblwrp.width(event.pageX - outertbl.offset().left - dat.x - bdwrp.position().left);
						hdwrp.width(bdwrp.width() - getScrollWidth());
						bdwrp.height(event.pageY - outertbl.offset().top - dat.y - bdwrp.position().top);
					}
				},
				mouseup: function() {
					(isFireFox || isIe) ? sTable.css('display', 'table') : null;
					outertbl.data().resize.state = false;
				}
			});
			addRow.on('click', rowAdd);

			search.on('keyup', textSearch);

			reload.on('click', function() {
				deleteRowsIds = [];
				var h = sTable.css('top');
				bdwrp.animate({
					scrollTop: 0
				}, 'swing', function() {
					sTable.animate({
						top: bdwrp.height() + 50
					}, 'swing', function() {
						var ops = sTable.data().plugin_advTable.options;
						var data = sTable.advTable.ajaxcall(ops.php.file, ops.name, ops.php.id, 'load', ops.php.user, passWord);
						var body = $(load(data, ops).tb);
						sTable.children('tbody').remove();
						sTable.append(body).delay(500).animate({
							top: h
						}, 'swing', function() {
							search.trigger('keyup');
						});
					})
				})
			});
			download.on('click', function() {
				var headText = '';
				var bodyText = '';
				var op = sTable.data().plugin_advTable.options;
				$.each(hTable.children('thead').children('tr').children('th').children('div'), function(index) {
					if (index == 0) {
						headText += $(this).html();
					} else {
						headText += op.delimiter + $(this).html();
					}
				});
				headText += '\n';
				$.each(sTable.children('tbody').children('tr'), function() {
					var rows = $(this);
					if (typeof rows.attr('class') == 'undefined' || rows.attr('class').indexOf('hide') == -1) {
						$.each(rows.children('td'), function(index) {
							if (index == 0) {
								bodyText += $(this).html();
							} else {
								bodyText += op.delimiter + $(this).html();
							}
						});
						bodyText += '\n';
					}
				})
				sTable.advTable.ajaxcall(op.php.file, op.name, op.php.id, 'download', headText + bodyText, passWord);
			});

			function isDate(s) {
				if (/[a-zA-z]/g.test(s)) return false;
				s = s.replace(/[\-|\.|_]/g, "/");
				var dt = new Date(Date.parse(s));
				var arrDateParts = s.split("/");
				if (arrDateParts.length < 3) return false;
				var y, m, d;
				arrDateParts[2].length == 4 ? (y = 2, m = 0, d = 1) : (y = 0, m = 1, d = 2);
				return (
				dt.getMonth() == parseInt(arrDateParts[m]) - 1 && dt.getDate() == parseInt(arrDateParts[d]) && dt.getFullYear() == parseInt(arrDateParts[y]));
			}

			function load(data, op) {
				var name = op.name;
				var php = op.php;
				var id = op.php.id;
				var tb = '<tbody>';
				var th = '<thead><tr>';
				for (var i = 0; i < data.length; i++) {
					tb += '<tr>';
					$.each(data[i], function(key, value) {
						i == 0 ? th += '<th>' + key + '</th>' : null;
						(typeof value == 'object' && value != null) ? tb += '<td>' + value.date + '</td>' : tb += '<td>' + value + '</td>';
					})
					tb += '</tr>';
				};
				th += '</thead>';
				tb += '</tbody>';
				return {
					th: th,
					tb: tb
				};

			}

			function getScrollWidth() {
				var d = $('<div style = "width:100px;height:100px;overflow:hidden">');
				var di = $('<div style = "width:100%;height:100%">');
				d.appendTo($('body'));
				d.append(di);
				var w1 = di.width();
				d.css('overflow', 'scroll');
				var w2 = di.width();
				d.remove();
				return w1 - w2;
			}

			function colCheck(obj) {
				if (obj.is('td') == false) {
					return
				}
				var ind = obj.index();
				var s = sTable.children('thead').children('tr').children('th').eq(ind);
				var h = hTable.children('thead').children('tr').children('th').eq(ind);
				s.children('div').width('auto');
				s.children('div').width(s.width());
				if (s.width() != h.width()) {
					s.children('div').width(s.width());
					h.children('div').width(s.width());
				}
				tblwrp.css('max-width', sTable.outerWidth(true) + getScrollWidth());
			}

			function rowAdd() {
				var newRow = sTable.children('tbody').children('tr').eq(0).clone(true);
				$.each(newRow.children('td'), function() {
					$(this).html('?')
				})
				sTable.children('tbody').append(newRow);
				newRow.removeClass();
				newRow.addClass('newRow');
				bdwrp.animate({
					scrollTop: newRow.position().top - bdwrp.height() + newRow.height()
				}, 'swing');
			}

			function textSearch() {
				rows = sTable.children('tbody').find('tr');
				var trows = rows.length;
				rows.addClass('hide');
				sTable.children('tbody').find('td').filter(function(index) {
					return $(this).html().toLocaleLowerCase().indexOf(search.val().toLocaleLowerCase()) != -1;
				}).parent('tr').removeClass('hide');
				var hrows = rows.parent().find('.hide').length;
				rlog.html('Total rows - Filtered rows: ' + trows.toString() + ' - ' + (trows - hrows).toString());
				bar.co = trows / (trows - hrows);
				bar.act = 0;
				bar.set();
			}

			function makeData(tr) {
				var rowData = []
				$.each(tr.children('td'), function() {
					rowData.push($(this).html());
				})
				return rowData;
			}
		},

		ajaxTable: function() {
			return $.fn.advTable.ajaxcall(this.options.php.file, this.options.name, this.options.php.id, 'reload', this.options.php.user, password);
		}
	};
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};
	$.fn[pluginName].ajaxcall = function(file, name, id, order, param, passWord, sync, bar) {
		typeof sync == 'undefined' ? sync = false : null;
		retVal = '';
		$.ajax({
			url: file,
			type: 'POST',
			dataType: 'xml/html/script/json/jsonp',
			async: sync,
			data: {
				id: id,
				name: name,
				order: order,
				param: param,
				pass: passWord
			},
			complete: function(data, xhr, textStatus) {
				if (sync) {
					bar.set()
				}
				retVal = $.parseJSON(data.responseText) || data;
			},
			success: function(data, textStatus, xhr) {
				//called when successful
			},
			error: function(xhr, textStatus, errorThrown) {
				//called when there is an error
			}
		});
		return retVal;
	};
})(jQuery, window, document);