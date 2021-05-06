# ProjectService

## NewProject

```mermaid
graph TD

subgraph NewProject
	s1((s1:9-10)) --> c1((c1:11))
	c1 --Yes--> s2((s2:12-15))
	c1 --No--> s3((s3:17))
	
	s2 --> s4((s4:20))
	s3 --> s4
end
```

## NewRoomProjectAndFile

```mermaid
graph TD

subgraph NewRoomProjectAndFile
	s1((s1:23)) --> s2((s2:24-35))
	s2 --> s3((s3:36))
end
```

## ModifyProject

```mermaid
graph TD

subgraph ModifyProject
	s1((s1:38-39)) --> c1((c1:40))
	c1 --> s2((s2:41))
	s2 --> c2((c2:42))
	c2 --> s3((s3:43))
	c2 --> s4((s4:45-48))
	c1 --> s5((s5:51))
	s3 --> s6((s6:54))
	s4 --> s6
	s5 --> s6
end
```

## GetProject

```mermaid
graph TD

subgraph GetProject
	s1((s1:57-58)) --> c1((c1:59))
	c1 --> s2((s2:60))
	s2 --> c2((c2:61))
	c2 --> s3((s3:62))
	c2 --> s4((s4:64-70))
	c1 --> s5((s5:72))
	s3 --> s6((s6:75))
	s4 --> s6
	s5 --> s6
end

```

## DeleteProject

```mermaid
graph TD

subgraph DeleteProject
	s1((s1:78-79)) --> c1((c1:80))
	c1 --> s2((s2:81))
	s2 --> c2((c2:82))
	c2 --> s3((s3:83-84))
	c2 --> s4((s4:86))
	c1 --> s5((s5:89))
	s3 --> s6((s6:92))
	s4 --> s6
	s5 --> s6
end
```

## NewFile

```mermaid
graph TD

subgraph NewFile
	s1((s1:95-96)) --> c1((c1:97))
	c1 --> s2((s2:98))
	s2 --> c2((c2:99))
	c2 --> s3((s3:100-104))
	c2 --> s4((s4:106))
	c1 --> s5((s5:110))
	s3 --> s6((s6:113))
	s4 --> s6
	s5 --> s6
end

```

## ModifyFile

```mermaid
graph TD

subgraph ModifyFile
	s1((s1:116-117)) --> c1((c1:118))
	c1 --> s2((s2:119-120))
	s2 --> c2((c2:121))
	c2 --> s3((s3:122))
	c2 --> s4((s4:124-127))
	c1 --> s5((s5:130))
	s3 --> s6((s6:133))
	s4 --> s6
	s5 --> s6
end
```

## DeleteFile

```mermaid
graph TD

subgraph DeleteFile
	s1((s1:136-137)) --> c1((c1:138))
	c1 --> s2((s2:139-140))
	s2 --> c2((c2:141))
	c2 --> s3((s3:142))
	c2 --> s4((s4:144-145))
	c1 --> s5((s5:148))
	s3 --> s6((s6:151))
	s4 --> s6
	s5 --> s6
end
```