#coding:utf-8
version = "Unicorn 0.2.0"
version_info = (0, 2, 0, 7)

# Ver 0,2,0,7
# 变更日期： 2015.07.05 0.2.07
# 修补了Postgresql下对Order by的判断Bug

# Ver 0,2,0,6
# 变更日期： 2015.07.01 0.2.06
# 重新加入Postgresql

# 变更日期： 2015.06.17 0.2.05
# 完善dbMysql.py update & delete 对ids的判断及处理bug

# 变更日期： 2015.06.12 0.2.04
# 增加对Oracle数据库的支持

# 变更日期： 2015.05.21  0.2.0.3
# (1) 修复 dbMysql.py __contact_where函数对find中有分页的where = { '':'{{'+conditions['where']+'}}'} 的处理，
#     处理方法为判断where的key是否为''，如果为空就直接返回后面的conditions

# 变更日期： 2015.05.19 0.2.0.2
# (1) 完善dbMysql.py update & delete 对ids的判断及处理bug

# 变更日期: 2015.04.21
# 增强了CURD.save 功能，确保可以按照指定的key值去修改（以前只能按照ID）

# 变更日期： 2015.04.18
#(1)修复 CURD.find 分页处理函数的Bug;
#(2)新增CURD.find返回时自动带上struct属性，如果是分页显示的会再自动带上count属性；
#(3)采用traceback.print_exc()增强代码调试在Debug I/O中的报错指引能力；
#(4)在Debug I/O 中直接输出 SQL 语句；
