from Bio import kNN
class model():
	def knn(self):
		xs = [[-53.0, -200.78], [117.0, -267.14], [57.0, -163.47], [16.0, -190.3], [11.0, -220.94], [85.0, -193.94], [16.0, -182.71], [15.0, -180.41], [-26.0, -181.73], [58.0, -259.87], [126.0, -414.53], [191.0, -249.57], [113.0, -265.28], [145.0, -312.99], [154.0, -213.83], [147.0, -380.85], [93.0, -291.13]]
		ys =[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
		k=3
		model = kNN.train(xs,ys,k)
		return model