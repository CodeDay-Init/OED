/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as moment from 'moment';
import { ExportDataSet, RawReadings } from '../types/readings';

/**
 * Function to converts the compressed meter data into a CSV formatted string.
 * @param items The compressed meter data.
 * @returns output A string containing the CSV formatted compressed meter data.
 */

function convertToCSV(items: ExportDataSet[]) {
	let csvOutput = 'Label,Readings,Start Timestamp\n';
	items.forEach(set => {
		const data = set.exportVals;
		const label = set.label;
		data.forEach(reading => {
			const info = reading.y;
			const startTimeStamp = moment(reading.x).format('dddd MMM DD YYYY hh:mm a');
			csvOutput += `"${label}",${info} kW,${startTimeStamp}\n`; // this assumes that meter readings are in kW
		});
	});
	return csvOutput;
}
/**
 * Function to download the formatted CSV file to the users computer.
 * @param inputCSV A String containing the formatted CSV data.
 * @param fileName A string representing the name of the file.
 */
function downloadCSV(inputCSV: string, fileName: string) {
	const element = document.createElement('a');
	element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(inputCSV)}`);
	element.setAttribute('download', fileName);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

/**
 * Function to export compressed data from the graph currently displaying. May be used for routing if more export options are added
 * @param dataSets An Object. The compressed data from each meter currently selected in the graph.
 * @param name the name of the file.
 */
export default function graphExport(dataSets: ExportDataSet[], name: string) {
	const dataToExport = convertToCSV(dataSets);
	downloadCSV(dataToExport, name);
}

/**
 * Function to export raw data that we request on button click
 * @param items list of readings directly from the database
 * @param filename export filename
 */
export function convertRawToCSV(items:RawReadings[],filename:string){
	let csvOutput = 'Label,Readings,Start Timestamp\n';
	items.forEach(ele => {
	    csvOutput += `"${ele.label}",${ele.reading},${ele.startTimestamp}`
    })
    downloadCSV(csvOutput,filename);
}

/**
 * Function that adds a div to handle exporting raw data
 * 
 */
export function graphRawExport(){
	const mainContainer=document.createElement('div');
	const innerContainer=document.createElement('div');
	mainContainer.appendChild(innerContainer);
	mainContainer.classList.add('fixed-top');
	mainContainer.classList.add('bg-dark');
	mainContainer.style.width='100vw';
	mainContainer.style.height='100vh';
	mainContainer.style.display='flex';
	mainContainer.style.opacity='0.7';
	mainContainer.style.justifyContent='center';
	mainContainer.style.alignItems='center';

	innerContainer.style.padding='20px 10px';
	innerContainer.style.backgroundColor='white';
	innerContainer.style.border='2px solid black';
	innerContainer.style.borderRadius='10px';

	const noButton=document.createElement('button');
	noButton.innerHTML='No';
	const yesButton=document.createElement('button');
	yesButton.innerHTML='Yes';

	innerContainer.appendChild(yesButton);
	innerContainer.appendChild(noButton);

	noButton.addEventListener('click',()=>{
		document.body.removeChild(mainContainer);
	})

	document.body.appendChild(mainContainer);
}