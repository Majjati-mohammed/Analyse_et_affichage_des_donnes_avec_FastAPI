async function analyseData() {

	const response = await fetch('http://127.0.0.1:8000/data');
	const data = await response.json();

	const ages = data.age;
	const revenus = data.revenu;
	const Revenu_par_secteur = data.revenu_par_secteur;
	const Revenu_par_niveau = data.revenu_par_niveau;
	const MoyRevenu = data.revenu_moyen;
	const Experience = data.experience;
	const MoyAge = data.moyAge;
	const Employes_par_ville = data.employes_par_ville;
	const Employes_par_secteur = data.employes_par_secteur;

	const points = ages.map((age, i) => ({
		x: age,
		y: Experience[i]
	}));

	const secteur = Revenu_par_secteur.map(item => item.secteur);
	const moyRevenu = Revenu_par_secteur.map(item => item.revenu);

	const niveau_etude = Revenu_par_niveau.map(item => item.niveau_etude);
	const moyRevenu2 = Revenu_par_niveau.map(item => item.revenu);

	const minX = Math.min(...Experience);
	const maxX = Math.max(...Experience);



	document.getElementById("Age").innerHTML = parseInt(MoyAge);
	document.getElementById("moyenneRevenue").innerHTML = MoyRevenu;
	document.getElementById("Employes_par_ville").innerHTML = parseInt(Employes_par_ville);
	document.getElementById("Employes_par_secteur").innerHTML = parseInt(Employes_par_secteur);



	const barColors = ["#000000ff", "#2e2e2eff", "#636363ff", "#8a8a8aff", "#c2c2c2ff", "#dbdbdbff"];


	new Chart("mychart1", {
		type: "pie",
		data: {
			labels: secteur,
			datasets: [{
				label: "Revenue Moyenne par secteur",
				backgroundColor: barColors,
				data: moyRevenu,
			}]
		},
		options: {
			legend: {
				display: true,
				responsive: false,
				maintainAspectRatio: false,
			},
		}
	});





	new Chart("mychart2", {
		type: "bar",
		data: {
			labels: ages,
			datasets: [{
				label: "Revenue par Age",
				backgroundColor: "black",
				data: revenus,
			}]
		},
		options: {
			legend: {
				display: false,
				responsive: false,
				maintainAspectRatio: false
			},

		}
	});


	new Chart("mychart3", {
		type: "bar",
		data: {
			labels: niveau_etude,
			datasets: [{
				label: "Revenue Moyenne par niveau d'étude",
				backgroundColor: "black",
				data: moyRevenu2,
			}]
		},
		options: {
			legend: {
				display: false,
				responsive: false,
				maintainAspectRatio: false
			},

		}
	});


	new Chart("mychart4", {

		data: {
			datasets: [{
				type: "scatter",
				label: "Experience vs Revenu",
				data: points,
				backgroundColor: "rgba(0, 0, 0, 0.7)",
			}],

		},
		options: {
			plugins: {
				legend: {
					display: false
				}
			},
			scales: {
				x: {
					title: {
						display: true,
						text: "Experience"
					}
				},
				y: {
					title: {
						display: true,
						text: "Revenu (MAD)"
					}
				}
			}
		}
	});



}


async function func() {
	const num1 = document.getElementById("txt1").value;
	const num2 = document.getElementById("txt2").value;

	const response = await fetch('http://127.0.0.1:8000/model', {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			num1,
			num2
		})
	});

	const data = await response.json();
	console.log(data);
	document.getElementById("predict").innerText = data.res.toFixed(2) + "DH";
}

analyseData();