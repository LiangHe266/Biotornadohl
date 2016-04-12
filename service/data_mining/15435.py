from Bio import kNN
class model():
	def knn(self):
		xs = [[1.0, 1.0], [1.0, 2.0], [1.0, 3.0], [1.0, 4.0]]
		ys =[1, 1, 0, 0]
		k=3
		model = kNN.train(xs,ys,k)
		return model