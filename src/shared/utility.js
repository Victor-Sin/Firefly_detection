export function getGuiElt(gui, mesh, name) {
	const eltFolder = gui.addFolder(name);

	const scaleFolder = eltFolder.addFolder('Scale');
	scaleFolder.add(mesh.scale, 'x', -20, 20, 0.01);
	scaleFolder.add(mesh.scale, 'y', -20, 20, 0.01);
	scaleFolder.add(mesh.scale, 'z', -20, 20, 0.01);

	const positionFolder = eltFolder.addFolder('Position');
	positionFolder.add(mesh.position, 'x', -20, 20, 0.01);
	positionFolder.add(mesh.position, 'y', -20, 20, 0.01);
	positionFolder.add(mesh.position, 'z', -20, 20, 0.01);

	const rotationFolder = eltFolder.addFolder('Rotation');
	rotationFolder.add(mesh.rotation, 'x', -20, 20, 0.01);
	rotationFolder.add(mesh.rotation, 'y', -20, 20, 0.01);
	rotationFolder.add(mesh.rotation, 'z', -20, 20, 0.01);

	eltFolder.add(mesh, 'castShadow');
	eltFolder.add(mesh, 'receiveShadow');
	eltFolder.add(mesh, 'visible');

	return eltFolder;
}
