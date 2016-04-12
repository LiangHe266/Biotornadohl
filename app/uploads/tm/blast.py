from Bio.Blast import NCBIWWW
from Bio.Blast import NCBIXML
result_handle = open("blastnnt8332116.xml")
blast_record = NCBIXML.read(result_handle)
E_VALUE_THRESH = 0.04
rowdata={}
rows=[]
print("adadasdsadsadasd")
print(blast_record.alignments)
for alignment in blast_record.alignments:
	for hsp in alignment.hsps:
		if hsp.expect < E_VALUE_THRESH:
			print("1231231")
			a=('****Alignment****')
			a1="sequence:"+str(alignment.title)
			a2="length:"+str(alignment.length)
			a3="e value:"+str(hsp.expect)
			a4=str(hsp.query)+'...'
			a5=str(hsp.match)+'...'
			a6=str(hsp.sbjct)+'...'
			print("里面呢")
			rows.append((a,a1,a2,a3,a4,a5,a6))
rowdata['rows']=rows
rowdata['count']=len(rows)
print(rowdata)
