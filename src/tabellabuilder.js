/*
 *  Copyright (C) 2014-2017  Interpromotion <info@interpromotion.com>
 *  Copyright (C) 2014-2017  Giancarlo Soverini <giancarlosoverini@gmail.com>
 *
 *  This file is part of Tabellajs.
 *
 *  Tabellajs is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  Tabellajs is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 */

	/*
	SCHEMA:

	*---------------------------------------------------------------------------------------------*
	| container                                                                                   |
	| *-----------------------------------------------------------------------------------------* |
	| | .t-row   /// first row has: .t-first-row                                                | |
	| | *-------------------------------------------------------------------------------------* | |
	| | | .t-row-header /// OPTIONAL                                                          | | |
	| | *-------------------------------------------------------------------------------------* | |
	| |    *-------------------------------------------------------------------------------------* | |
	| | | .t-row-content-wrapper  /// Overflow : hidden                                       | | |
	| | | *---------------------------------------------------------------------------------* | | |
	| | | | .t-row-content                                                                  | | | |
	| | | | *------------------------* *--------------------------------------------------* | | | |
	| | | | | .t-row-desc            | | .t-row-values                                    | | | | |
	| | | | | *--------------------* | | *----------------------------------------------* | | | | |
	| | | |       | | .t-element              | | | |  .t-sliding-row   <<<<<< SLIDING PART >>>>>> | | | | | |
	| | | | | | *----------------* | | | | *------------------------------------------* | | | | | |
	| | | | | |   | .t-cell-desc-l | | | | | | .t-row-cell                              | | | | | | |
	| | | | | |   *----------------* | | | | | *--------------------------------------* | | | | | | |
	| | | | | *--------------------* | | | | | .t-element                           | | | | | | | |
	| | | | |                                                | | | | | *----------------* *---------------* | | | | | | | |
	| | | | |                                              | | | | | |.t-cell-desc-s  | | .t-cell-value | | | | | | | | |
	| | | | |                                                   | | | | | *----------------* *---------------* | | | | | | | |
	| | | | |                                                     | | | | *--------------------------------------* | | | | | | |
	| | | | |                           | | | *------------------------------------------* | | | | | |
	| | | | |                        | | *----------------------------------------------* | | | | |
	| | | | *------------------------* *--------------------------------------------------* | | | |
	| | | *---------------------------------------------------------------------------------* | | |
	| | *-------------------------------------------------------------------------------------* | |
	| *-----------------------------------------------------------------------------------------* |
	*---------------------------------------------------------------------------------------------*

	*/

	var TabellaBuilder = {

		setUpTableHeader: function(el, options) {

			var tableHeader = options.tableHeader,
				docfrag = document.createDocumentFragment(),
				tRow,
                tRowDesc,
                tEl;

			try {

				if (tableHeader instanceof Array && tableHeader.length) {

					//Table header row's container
					var fixedHeader = createHTMLEl('div', 't-fixed-header', docfrag);

					tRow = createHTMLEl('div', 't-row t-first-row', fixedHeader);

					var tRowContentWrapper = createHTMLEl('div', 't-row-content-wrapper', tRow);

					var tRowContent = createHTMLEl('div', 't-row-content', tRowContentWrapper);

					var tRowDescHTML = '<div class="t-element">';
					tRowDescHTML += '<div class="t-cell-desc-l">';
					tRowDescHTML += options.from;

					if (typeof tableHeader[0][1] !== 'undefined') {
						tRowDescHTML += '<span class="t-header-devider">' + options.headerRowDevider + '</span>';
						tRowDescHTML += options.to;
					}

					tRowDescHTML += '</div>';
					tRowDescHTML += '</div>';

					tRowDesc = createHTMLEl('div', 't-row-desc', tRowContent, tRowDescHTML);

					var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);

					var tSlidingRow = createHTMLEl('div', 't-sliding-row', tRowValues);

					for (var i = 0; i < tableHeader.length; i++) {

						var tRowCell = document.createElement('div');
						tRowCell.className = 't-row-cell';

						//From - to Div
						var tableHeaderCellHTML = '<div class="t-cell-desc-s">';
						tableHeaderCellHTML += options.from;
						if (typeof tableHeader[i][1] !== 'undefined') {
							tableHeaderCellHTML += '<span class="t-header-devider">' + options.headerRowDevider + '</span>';
							tableHeaderCellHTML += options.to;
						}
						tableHeaderCellHTML += '</div>';

						//Table headr cell actual value
						tableHeaderCellHTML += '<div class="t-cell-value t-bold">';
						tableHeaderCellHTML += typeof tableHeader[i][0] !== 'undefined' ? tableHeader[i][0] : 'not set';
						if (typeof tableHeader[i][1] !== 'undefined') {
							tableHeaderCellHTML += '<span class="t-header-devider">' + options.headerRowDevider + '</span>';
							tableHeaderCellHTML += tableHeader[i][1];
						}
						tableHeaderCellHTML += '</div>';

						tEl = createHTMLEl('div', 't-element', tRowCell, tableHeaderCellHTML);

						tSlidingRow.appendChild(tRowCell);
					}

					el.appendChild(docfrag);


				} else {
					throw new TabellaException('tableHeader is not an Array');
				}

			} catch (err) {

				tRow = false;
				console.error(err.toString());

			} finally {
				return tRow;
			}
		},

		setUpRows: function(el, options) {
            // console.log(options);

			var tableHeader = options.tableHeader,
				rows = options.rows,
				numberOfRows = rows.length,
							tHeader,
							tRowDesc,
							tEl;

			var docfrag = document.createDocumentFragment();

			if (numberOfRows > 0) {

				for (var i = 0; i < numberOfRows; i++) {
					var tRow = createHTMLEl('div', 't-row', docfrag); //создали строку общую

					if (!!rows[i].rowHeader) {
						tHeader = createHTMLEl('section', 't-row-header', tRow, rows[i].rowHeader);
					}

					if (!!rows[i].rowVal) {

						for (var j = 0; j < rows[i].rowVal.length; j++) {

                            // создали строку таблицы
                            var tRowContentWrapper = createHTMLEl('div', 't-row-content-wrapper', tRow);

							var tRowContent = createHTMLEl('div', 't-row-content', tRowContentWrapper);

							var tRowDescHTML = '<div class="t-element">';
                            tRowDescHTML += '<div class="t-cell-desc-l">';
							tRowDescHTML += (typeof rows[i].rowDesc !== 'undefined' && !!rows[i].rowDesc[j]) ? rows[i].rowDesc[j] : '';
							tRowDescHTML += '</div>';
							tRowDescHTML += '</div>';

							var descClass = 't-row-desc';
							if (j >= 1) descClass += ' t-cell-border-top';

							tRowDesc = createHTMLEl('div', descClass, tRowContent, tRowDescHTML);

							var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);

							var tSlidingRow = createHTMLEl('div', 't-sliding-row', tRowValues);

							for (var k = 0; k < tableHeader.length; k++) {
								var tRowCell = document.createElement('div');
								var cellClass = 't-row-cell';

								if (j >= 1) cellClass += ' t-cell-border-top';

								tRowCell.className = cellClass;

								var cellHTML = '';

								//Cell description
								if (typeof rows[i].rowDesc !== 'undefined' && !!rows[i].rowDesc[j]) {

									cellHTML += '<div class="t-cell-desc-s">';

									cellHTML += rows[i].rowDesc[j];

									cellHTML += '</div>';
								}

								//Item current value
								cellHTML += '<div class="t-cell-value">';

								if(rows[i].rowVal[j][k] === false) {
									cellHTML += '';
								} else if(rows[i].rowVal[j][k] === true) {
									cellHTML += '<img style="width: 15px;user-select: none; pointer-events: none;" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTIgNDkyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0OTIgNDkyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMzAwLjE4OCwyNDZMNDg0LjE0LDYyLjA0YzUuMDYtNS4wNjQsNy44NTItMTEuODIsNy44Ni0xOS4wMjRjMC03LjIwOC0yLjc5Mi0xMy45NzItNy44Ni0xOS4wMjhMNDY4LjAyLDcuODcyICAgIGMtNS4wNjgtNS4wNzYtMTEuODI0LTcuODU2LTE5LjAzNi03Ljg1NmMtNy4yLDAtMTMuOTU2LDIuNzgtMTkuMDI0LDcuODU2TDI0Ni4wMDgsMTkxLjgyTDYyLjA0OCw3Ljg3MiAgICBjLTUuMDYtNS4wNzYtMTEuODItNy44NTYtMTkuMDI4LTcuODU2Yy03LjIsMC0xMy45NiwyLjc4LTE5LjAyLDcuODU2TDcuODcyLDIzLjk4OGMtMTAuNDk2LDEwLjQ5Ni0xMC40OTYsMjcuNTY4LDAsMzguMDUyICAgIEwxOTEuODI4LDI0Nkw3Ljg3Miw0MjkuOTUyYy01LjA2NCw1LjA3Mi03Ljg1MiwxMS44MjgtNy44NTIsMTkuMDMyYzAsNy4yMDQsMi43ODgsMTMuOTYsNy44NTIsMTkuMDI4bDE2LjEyNCwxNi4xMTYgICAgYzUuMDYsNS4wNzIsMTEuODI0LDcuODU2LDE5LjAyLDcuODU2YzcuMjA4LDAsMTMuOTY4LTIuNzg0LDE5LjAyOC03Ljg1NmwxODMuOTYtMTgzLjk1MmwxODMuOTUyLDE4My45NTIgICAgYzUuMDY4LDUuMDcyLDExLjgyNCw3Ljg1NiwxOS4wMjQsNy44NTZoMC4wMDhjNy4yMDQsMCwxMy45Ni0yLjc4NCwxOS4wMjgtNy44NTZsMTYuMTItMTYuMTE2ICAgIGM1LjA2LTUuMDY0LDcuODUyLTExLjgyNCw3Ljg1Mi0xOS4wMjhjMC03LjIwNC0yLjc5Mi0xMy45Ni03Ljg1Mi0xOS4wMjhMMzAwLjE4OCwyNDZ6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />';
								} else if (typeof rows[i].rowVal[j][k] !== 'undefined') {
                                    cellHTML += rows[i].rowVal[j][k];

									// If it's a number we add the currency
									if (!isNaN(rows[i].rowVal[j][k])) {
										cellHTML += ' ' + options.currency;
									}
								} else {
									cellHTML += options.emptyCell;
								}
								cellHTML += '</div>';


								tEl = createHTMLEl('div', 't-element', tRowCell, cellHTML);

								tSlidingRow.appendChild(tRowCell);
							}
						}
					}
				}

				el.appendChild(docfrag);

				return numberOfRows;

			} else {

				return false;

			}

		},

		setUpArrows: function(tableHeaderRow, options) {
			var arrowRight = createHTMLEl('div', 't-arr-right t-hide', tableHeaderRow);
			var arrowLeft = createHTMLEl('div', 't-arr-left t-hide', tableHeaderRow);

			if (options.leftArrow) {
				arrowLeft.appendChild(options.leftArrow);
			}
			else {
				var svgLeft = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
				svgLeft.setAttribute('viewBox', '0 0 100 100');

				var pathLeft = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				pathLeft.setAttribute('d', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z');
				pathLeft.setAttribute('transform', 'translate(15,0)');

				pathLeft.setAttribute('class', 't-svg-arrow');
				svgLeft.appendChild(pathLeft);

				arrowLeft.appendChild(svgLeft);
			}

			if (options.rightArrow) {
				arrowRight.appendChild(options.rightArrow);
			}
			else {
				var svgRight = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
				svgRight.setAttribute('viewBox', '0 0 100 100');

				var pathRight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				pathRight.setAttribute('d', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z');
				pathRight.setAttribute('transform', 'translate(85,100) rotate(180)');

				pathRight.setAttribute('class', 't-svg-arrow');
				svgRight.appendChild(pathRight);

				arrowRight.appendChild(svgRight);
			}

			return {
				arrowRight: arrowRight,

				arrowLeft: arrowLeft
			};

		}

	};
