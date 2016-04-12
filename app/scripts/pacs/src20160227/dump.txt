root@wellsvm:/workspace/dicom/DCM_FILES/E1682558# dcmdump I00094100215.dcm

# Dicom-File-Format

# Dicom-Meta-Information-Header
# Used TransferSyntax: Little Endian Explicit
(0002,0000) UL 212                                      #   4, 1 FileMetaInformationGroupLength
(0002,0001) OB 00\01                                    #   2, 1 FileMetaInformationVersion
(0002,0002) UI =CTImageStorage                          #  26, 1 MediaStorageSOPClassUID
(0002,0003) UI [1.2.392.200036.9116.2.5.1.48.1221418399.1451001270.913569] #  58, 1 MediaStorageSOPInstanceUID
(0002,0010) UI =LittleEndianExplicit                    #  20, 1 TransferSyntaxUID
(0002,0012) UI [1.2.410.200010.99.3.5]                  #  22, 1 ImplementationClassUID
(0002,0013) SH [INF_4.5]                                #   8, 1 ImplementationVersionName
(0002,0016) AE [TM_CT_CMW_V3.00]                        #  16, 1 SourceApplicationEntityTitle

# Dicom-Data-Set
# Used TransferSyntax: Little Endian Explicit
(0008,0000) UL 592                                      #   4, 1 GenericGroupLength
(0008,0008) CS [ORIGINAL\PRIMARY\AXIAL]                 #  22, 3 ImageType
(0008,0016) UI =CTImageStorage                          #  26, 1 SOPClassUID
(0008,0018) UI [1.2.392.200036.9116.2.5.1.48.1221418399.1451001270.913569] #  58, 1 SOPInstanceUID
(0008,0020) DA [20151225]                               #   8, 1 StudyDate
(0008,0021) DA [20151225]                               #   8, 1 SeriesDate
(0008,0022) DA [20151225]                               #   8, 1 AcquisitionDate
(0008,0023) DA [20151225]                               #   8, 1 ContentDate
(0008,0030) TM [084446.000]                             #  10, 1 StudyTime
(0008,0031) TM [084633.509]                             #  10, 1 SeriesTime
(0008,0032) TM [084735.900]                             #  10, 1 AcquisitionTime
(0008,0033) TM [084737.423]                             #  10, 1 ContentTime
(0008,0050) SH [11797453]                               #   8, 1 AccessionNumber
(0008,0060) CS [CT]                                     #   2, 1 Modality
(0008,0070) LO [TOSHIBA]                                #   8, 1 Manufacturer
(0008,0080) LO [Chengdu Army General Hospital]          #  30, 1 InstitutionName
(0008,0090) PN [-]                                      #   2, 1 ReferringPhysicianName
(0008,1010) SH [ID_STATION]                             #  10, 1 StationName
(0008,103e) LO [ Body 1.0 CE]                           #  12, 1 SeriesDescription
(0008,1040) LO [ID_DEPARTMENT]                          #  14, 1 InstitutionalDepartmentName
(0008,1090) LO [Aquilion ONE]                           #  12, 1 ManufacturerModelName
(0008,1110) SQ (Sequence with explicit length #=1)      # 144, 1 ReferencedStudySequence
  (fffe,e000) na (Item with explicit length #=2)          # 136, 1 Item
    (0008,1150) UI [1.2.410.200010.1081152.796.1531683.1682240.11797453.1682240] #  60, 1 ReferencedSOPClassUID
    (0008,1155) UI [1.2.410.200010.1081152.796.1531683.1682240.11797453.1682240] #  60, 1 ReferencedSOPInstanceUID
  (fffe,e00d) na (ItemDelimitationItem for re-encoding)   #   0, 0 ItemDelimitationItem
(fffe,e0dd) na (SequenceDelimitationItem for re-encod.) #   0, 0 SequenceDelimitationItem
(0010,0000) UL 110                                      #   4, 1 GenericGroupLength
(0010,0010) PN [JI KAI HUI]                             #  10, 1 PatientName
(0010,0020) LO [Z000016388]                             #  10, 1 PatientID
(0010,0030) DA [19560408]                               #   8, 1 PatientBirthDate
(0010,0040) CS [F]                                      #   2, 1 PatientSex
(0010,1000) LO [Z000016388]                             #  10, 1 OtherPatientIDs
(0010,1001) PN [JI KAI HUI]                             #  10, 1 OtherPatientNames
(0010,1010) AS [059Y]                                   #   4, 1 PatientAge
(0018,0000) UL 386                                      #   4, 1 GenericGroupLength
(0018,0010) LO [CE]                                     #   2, 1 ContrastBolusAgent
(0018,0015) CS [ABDOMEN]                                #   8, 1 BodyPartExamined
(0018,0022) CS [HELICAL_CT]                             #  10, 1 ScanOptions
(0018,0050) DS [1.0]                                    #   4, 1 SliceThickness
(0018,0060) DS [120]                                    #   4, 1 KVP
(0018,0090) DS [500.00]                                 #   6, 1 DataCollectionDiameter
(0018,1000) LO [2EA1052200]                             #  10, 1 DeviceSerialNumber
(0018,1020) LO [V4.74ER004]                             #  10, 1 SoftwareVersions
(0018,1030) LO [(370) liver-8mm---p+z(test)180hu]       #  32, 1 ProtocolName
(0018,1042) TM [084650.200]                             #  10, 1 ContrastBolusStartTime
(0018,1100) DS [400.39]                                 #   6, 1 ReconstructionDiameter
(0018,1120) DS [+0.0]                                   #   4, 1 GantryDetectorTilt
(0018,1130) DS [+116.00]                                #   8, 1 TableHeight
(0018,1140) CS [CW]                                     #   2, 1 RotationDirection
(0018,1150) IS [500]                                    #   4, 1 ExposureTime
(0018,1151) IS [227]                                    #   4, 1 XRayTubeCurrent
(0018,1152) IS [113]                                    #   4, 1 Exposure
(0018,1160) SH [LARGE]                                  #   6, 1 FilterType
(0018,1170) IS [20]                                     #   2, 1 GeneratorPower
(0018,1190) DS [1.6\1.4]                                #   8, 2 FocalSpots
(0018,1210) SH [FC07]                                   #   4, 1 ConvolutionKernel
(0018,5100) CS [FFS]                                    #   4, 1 PatientPosition
(0018,9311) FD 0.86999999999999993                      #   8, 1 SpiralPitchFactor
(0018,9323) CS [3D]                                     #   2, 1 ExposureModulationType
(0018,9324) FD 28.350000000000001                       #   8, 1 EstimatedDoseSaving
(0018,9345) FD 9.8000000000000007                       #   8, 1 CTDIvol
(0020,0000) UL 438                                      #   4, 1 GenericGroupLength
(0020,000d) UI [1.2.410.200010.1081152.796.1531683.1682240.11797453.1682240] #  60, 1 StudyInstanceUID
(0020,000e) UI [1.2.392.200036.9116.2.5.1.48.1221418399.1451001220.171238] #  58, 1 SeriesInstanceUID
(0020,0010) SH [1682240]                                #   8, 1 StudyID
(0020,0011) IS [9]                                      #   2, 1 SeriesNumber
(0020,0012) IS [6]                                      #   2, 1 AcquisitionNumber
(0020,0013) IS [113]                                    #   4, 1 InstanceNumber
(0020,0020) CS [L\P]                                    #   4, 2 PatientOrientation
(0020,0032) DS [-197.8511\-199.8043\1914.90]            #  28, 3 ImagePositionPatient
(0020,0037) DS [1.00000\0.00000\0.00000\0.00000\1.00000\0.00000] #  48, 6 ImageOrientationPatient
(0020,0052) UI [1.2.392.200036.9116.2.5.1.48.1221418399.1451000688.498254] #  58, 1 FrameOfReferenceUID
(0020,1040) LO (no value available)                     #   0, 0 PositionReferenceIndicator
(0020,1041) DS [+89.60]                                 #   6, 1 SliceLocation
(0020,4000) LT [Venous\Phase]                           #  12, 1 ImageComments
(0020,9056) SH [1_0778_00002]                           #  12, 1 StackID
(0020,9057) UL 113                                      #   4, 1 InStackPositionNumber
(0020,9128) UL 1                                        #   4, 1 TemporalPositionIndex
(0028,0000) UL 152                                      #   4, 1 GenericGroupLength
(0028,0002) US 1                                        #   2, 1 SamplesPerPixel
(0028,0004) CS [MONOCHROME2]                            #  12, 1 PhotometricInterpretation
(0028,0010) US 512                                      #   2, 1 Rows
(0028,0011) US 512                                      #   2, 1 Columns
(0028,0030) DS [0.782\0.782]                            #  12, 2 PixelSpacing
(0028,0100) US 16                                       #   2, 1 BitsAllocated
(0028,0101) US 16                                       #   2, 1 BitsStored
(0028,0102) US 15                                       #   2, 1 HighBit
(0028,0103) US 1                                        #   2, 1 PixelRepresentation
(0028,1050) DS [40]                                     #   2, 1 WindowCenter
(0028,1051) DS [400]                                    #   4, 1 WindowWidth
(0028,1052) DS [0]                                      #   2, 1 RescaleIntercept
(0028,1053) DS [1]                                      #   2, 1 RescaleSlope
(0040,0000) UL 220                                      #   4, 1 GenericGroupLength
(0040,0002) DA [20151225]                               #   8, 1 ScheduledProcedureStepStartDate
(0040,0003) TM [140001]                                 #   6, 1 ScheduledProcedureStepStartTime
(0040,0004) DA [20151225]                               #   8, 1 ScheduledProcedureStepEndDate
(0040,0005) TM [143001.000]                             #  10, 1 ScheduledProcedureStepEndTime
(0040,0244) DA [20151225]                               #   8, 1 PerformedProcedureStepStartDate
(0040,0245) TM [084446.000]                             #  10, 1 PerformedProcedureStepStartTime
(0040,0253) SH [121625]                                 #   6, 1 PerformedProcedureStepID
(0040,0275) SQ (Sequence with explicit length #=1)      #  96, 1 RequestAttributesSequence
  (fffe,e000) na (Item with explicit length #=4)          #  88, 1 Item
    (0032,1060) LO [?|??¡ì??CT??+??]                    #  20, 1 RequestedProcedureDescription
    (0040,0007) LO [?|??¡ì??CT??+??]                    #  20, 1 ScheduledProcedureStepDescription
    (0040,0009) SH [1616671]                                #   8, 1 ScheduledProcedureStepID
    (0040,1001) SH [1682240]                                #   8, 1 RequestedProcedureID
  (fffe,e00d) na (ItemDelimitationItem for re-encoding)   #   0, 0 ItemDelimitationItem
(fffe,e0dd) na (SequenceDelimitationItem for re-encod.) #   0, 0 SequenceDelimitationItem
(7005,0000) UL 632                                      #   4, 1 PrivateGroupLength
(7005,0010) LO [TOSHIBA_MEC_CT3]                        #  16, 1 PrivateCreator
(7005,1006) UN 30\30\3a\34\37\2e\32\20                  #   8, 1 Unknown Tag & Data
(7005,1007) UN 32\35\38\5c\32\35\36\20                  #   8, 1 Unknown Tag & Data
(7005,1008) UN 30\2e\35\20                              #   4, 1 Unknown Tag & Data
(7005,100a) UN 2b\34\33\2e\35\30                        #   6, 1 Unknown Tag & Data
(7005,100b) UN 41\49\44\52\20\33\44\20\53\54\44\20      #  12, 1 Unknown Tag & Data
(7005,100d) UN 41\42\44\4f\4d\45\4e\20                  #   8, 1 Unknown Tag & Data
(7005,100e) UN 49\4d\47\20                              #   4, 1 Unknown Tag & Data
(7005,100f) UN 46\46                                    #   2, 1 Unknown Tag & Data
(7005,1011) UN 56\6f\6c\2e                              #   4, 1 Unknown Tag & Data
(7005,1012) UN 53\55                                    #   2, 1 Unknown Tag & Data
(7005,1013) UN 01\00                                    #   2, 1 Unknown Tag & Data
(7005,1015) UN 03\00                                    #   2, 1 Unknown Tag & Data
(7005,1016) UN 31\2e\32\2e\33\39\32\2e\32\30\30\30\33\36\2e\39\31\31\36\2e\32\2e... #  58, 1 Unknown Tag & Data
(7005,1017) UN dd\00                                    #   2, 1 Unknown Tag & Data
(7005,1018) UN 71\00                                    #   2, 1 Unknown Tag & Data
(7005,1019) UN 0b\11\19\00                              #   4, 1 Unknown Tag & Data
(7005,101a) UN 01\00                                    #   2, 1 Unknown Tag & Data
(7005,101b) UN 46\43\30\37                              #   4, 1 Unknown Tag & Data
(7005,101c) UN 43\45                                    #   2, 1 Unknown Tag & Data
(7005,101d) UN 09\00\00\00                              #   4, 1 Unknown Tag & Data
(7005,101e) UN 01\00\00\00                              #   4, 1 Unknown Tag & Data
(7005,101f) UN 32\30\31\35\31\32\32\35\30\38\35\33\34\30\31\37\31\36\32\33 #  20, 1 Unknown Tag & Data
(7005,1020) UN 0a\00\00\00                              #   4, 1 Unknown Tag & Data
(7005,1022) UN 30\2e\38\30                              #   4, 1 Unknown Tag & Data
(7005,1023) UN 30\2e\38\37\30\20                        #   6, 1 Unknown Tag & Data
(7005,1024) UN 32\30\31\35\31\32\31\35                  #   8, 1 Unknown Tag & Data
(7005,1030) UN 43\54                                    #   2, 1 Unknown Tag & Data
(7005,1040) UN 33\33\33\33\33\a3\6e\40                  #   8, 1 Unknown Tag & Data
(7005,1041) UN 30\2e\35\78\31\30\30\20                  #   8, 1 Unknown Tag & Data
(7005,1043) UN 30\2e\30\30\30\30\30\5c\30\2e\30\30\30\30\30\5c\2d\31\2e\30\30\30... #  24, 1 Unknown Tag & Data
(7005,1063) UN 9a\99\99\99\99\99\23\40                  #   8, 1 Unknown Tag & Data
(7fe0,0010) OW f800\f800\f800\f800\f800\f800\f800\f800\f800\f800\f800\f800\f800... # 524288, 1 PixelData
root@wellsvm:/workspace/dicom/DCM_FILES/E1682558# 
root@wellsvm:/workspace/dicom/DCM_FILES/E1682558# 
