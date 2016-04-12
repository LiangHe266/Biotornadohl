#coding:utf-8
from BioTornado.Base import WebRequestHandler,BaseError,operator_except
from graphics import entity
import re
import time
from reportlab.lib import colors
from reportlab.lib.units import cm
from Bio.Graphics import GenomeDiagram
from Bio.Graphics import BasicChromosome
from Bio import SeqIO
from Bio.SeqFeature import SeqFeature, FeatureLocation

class Restful(WebRequestHandler):

    @operator_except
    def get(self):      #查找和查询

        s=entity.hosInfo(self.db) 
        #cent_code='004'
        
        offset   = int(self.get_argument('o',default='1'))
        rowcount = int(self.get_argument('r',default='10'))
        offset=(offset-1)*rowcount
        no=self.get_argument("no",default='')
        file_id=self.get_argument("file_id",default='')
        cur=self.db.getCursor()
        if no=='1':
        
            sql="select a.path from public.file a where a.id=%s "%(file_id)
            cur.execute(sql)
            row = cur.fetchone()
            rowdata={}
            rowdata['rows']=row
            print(row)
            
            filename="/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/app/"+row[0]
            imgfile=filename[:-2]+"svg"
            imgfile1=filename[:-2]+"1.svg"
            print(filename)
            print(imgfile)
            record = SeqIO.read(filename, "genbank")
            
            gd_diagram = GenomeDiagram.Diagram(record.id)
            gd_track_for_features = gd_diagram.new_track(1, name="Annotated Features")
            gd_feature_set = gd_track_for_features.new_set()
            
            for feature in record.features:
                if feature.type != "gene":
                    #Exclude this feature
                    continue
                if len(gd_feature_set) % 2 == 0:
                    color = colors.blue
                else:
                    color = colors.lightblue
                gd_feature_set.add_feature(feature, sigil="ARROW",
                                           color=color, label=True,
                                           label_size = 14, label_angle=0)
            
            #I want to include some strandless features, so for an example
            #will use EcoRI recognition sites etc.
            for site, name, color in [("GAATTC","EcoRI",colors.green),
                                      ("CCCGGG","SmaI",colors.orange),
                                      ("AAGCTT","HindIII",colors.red),
                                      ("GGATCC","BamHI",colors.purple)]:
                index = 0
                while True:
                    index  = record.seq.find(site, start=index)
                    if index == -1 : break
                    feature = SeqFeature(FeatureLocation(index, index+len(site)))
                    gd_feature_set.add_feature(feature, color=color, name=name,
                                               label=True, label_size = 10,
                                               label_color=color)
                    index += len(site)
            
            gd_diagram.draw(format="linear", pagesize='A4', fragments=4,
                            start=0, end=len(record))
            #gd_diagram.write("plasmid_linear_nice.pdf", "PDF")
            #gd_diagram.write("plasmid_linear_nice.eps", "EPS")
            gd_diagram.write(imgfile, "SVG")
            
            gd_diagram.draw(format="circular", circular=True, pagesize=(20*cm,20*cm),
                            start=0, end=len(record), circle_core = 0.5)
            #gd_diagram.write("plasmid_circular_nice.pdf", "PDF")
            #gd_diagram.write("plasmid_circular_nice.eps", "EPS")
            gd_diagram.write(imgfile1, "SVG")            
        elif no=='2':
            q=0
            pdffile="/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/app/uploads/tm/"+file_id+".pdf"
            pdf="uploads/tm/"+file_id+".pdf"
            file_id=file_id.split(',')
            sql1="where a.id=%s "%(file_id[q])
            for i in range(len(file_id)-1):
                sql1=sql1+"or a.id=%s "%(file_id[q+1])
                q=q+1
            sql="select a.path,a.file_name from public.file a  %s "%(sql1)
            cur.execute(sql)
            row = cur.fetchall()
            print(row)
            rowdata={}
            rowdata['rows']=pdf
            q=0
            a=[]
            entriess = []
            entries = []
            for i in range(len(row)):
                filepath="/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/app/"+row[q][0]
                
                filename=row[q][1]
                entriess.append((filename,filepath))
                q=q+1
            for(name,path) in entriess:
                record=SeqIO.read(path,"fasta")
                a.append(len(record))
                entries.append((name,len(record)))
            max_len = max(a)
            telomere_length = 1000000 #For illustration
            
            chr_diagram = BasicChromosome.Organism()
            chr_diagram.page_size = (29.7*cm, 21*cm) #A4 landscape
            
            for name, length in entries:
                cur_chromosome = BasicChromosome.Chromosome(name)
                #Set the scale to the MAXIMUM length plus the two telomeres in bp,
                #want the same scale used on all five chromosomes so they can be
                #compared to each other
                cur_chromosome.scale_num = max_len + 2 * telomere_length
            
                #Add an opening telomere
                start = BasicChromosome.TelomereSegment()
                start.scale = telomere_length
                cur_chromosome.add(start)
            
                #Add a body - using bp as the scale length here.
                body = BasicChromosome.ChromosomeSegment()
                body.scale = length
                cur_chromosome.add(body)
            
                #Add a closing telomere
                end = BasicChromosome.TelomereSegment(inverted=True)
                end.scale = telomere_length
                cur_chromosome.add(end)
            
                #This chromosome is done
                chr_diagram.add(cur_chromosome)
            
            chr_diagram.draw(pdffile, "Arabidopsis thaliana")
        elif no=='3':
            q=0
            pdffile="/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/app/uploads/tm/"+file_id+".pdf"
            pdf="uploads/tm/"+file_id+".pdf"
            file_id=file_id.split(',')
            sql1="where a.id=%s "%(file_id[q])
            for i in range(len(file_id)-1):
                sql1=sql1+"or a.id=%s "%(file_id[q+1])
                q=q+1
            sql="select a.path,a.file_name from public.file a  %s "%(sql1)
            cur.execute(sql)
            row = cur.fetchall()
            print(row)
            rowdata={}
            rowdata['rows']=pdf
            q=0
            a=[]
            entries = []
            for i in range(len(row)):
                filepath="/home/ubuntu/pythonff/mdt/mdt/mdtproject/trunk/app/"+row[q][0]
        
                filename=row[q][1]
                entries.append((filename,filepath))
                q=q+1
            for(name,path) in entries:
                record=SeqIO.read(path,"genbank")
                a.append(len(record))
            max_len=max(a)
            telomere_length = 1000000 #For illustration
            
            chr_diagram = BasicChromosome.Organism()
            chr_diagram.page_size = (29.7*cm, 21*cm) #A4 landscape
            
            for index, (name, filename) in enumerate(entries):
                record = SeqIO.read(filename,"genbank")
                length = len(record)
                features = [f for f in record.features if f.type=="tRNA"]
                #Record an Artemis style integer color in the feature's qualifiers,
                #1 = Black, 2 = Red, 3 = Green, 4 = blue, 5 =cyan, 6 = purple
                for f in features: f.qualifiers["color"] = [index+2]
            
                cur_chromosome = BasicChromosome.Chromosome(name)
                #Set the scale to the MAXIMUM length plus the two telomeres in bp,
                #want the same scale used on all five chromosomes so they can be
                #compared to each other
                cur_chromosome.scale_num = max_len + 2 * telomere_length
            
                #Add an opening telomere
                start = BasicChromosome.TelomereSegment()
                start.scale = telomere_length
                cur_chromosome.add(start)
            
                #Add a body - again using bp as the scale length here.
                body = BasicChromosome.AnnotatedChromosomeSegment(length, features)
                body.scale = length
                cur_chromosome.add(body)
            
                #Add a closing telomere
                end = BasicChromosome.TelomereSegment(inverted=True)
                end.scale = telomere_length
                cur_chromosome.add(end)
            
                #This chromosome is done
                chr_diagram.add(cur_chromosome)
            
            chr_diagram.draw(pdffile, "Arabidopsis thaliana")            
        self.response(rowdata)

