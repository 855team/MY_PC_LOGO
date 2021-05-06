# Dataflow

## HandleRoom

### DEF-USE

括号表示同名变量所在的作用域。

|变量名|DEF|USE|
|:-:|:-:|:-:|
|sse.Rooms|B0, B7|C4, B7|
|sse.Glock|B0|B7|
|flusher|B0|B1, B3, B7, B9, B15, B19, B20, B21|
|uid|B2|C1, C5, C8, C9, C11, B7, B11, B15, B16, B19|
|isNew|B4|C2|
|entry(isNew)|B7|B7|
|rid(isNew)|B7|B7|
|entry(!isNew)|C4, B11, B12, B13, B14, B15, B16, B17, B19|C5, C6, C7, C8, C9, C10, C11, B10, B15, B16, B18, B19|
|rid(!isNew)|B8|C4, B15, B19|

### 全定义使用

1. B0->C0->B2->C1->B4->C2->B5->C3->B6->B7->return
2. B0->C0->B2->C1->B4->C2->B8->C4->C5->B10->C6->B11->B13->C7->B14->B15->return
3. B0->C0->B2->C1->B4->C2->B8->C4->C5->B10->C6->B12->B13->C7->B14->B15->return
4. B0->C0->B2->C1->B4->C2->B8->C4->C5->C8->B16->C9->B17->C10->B19->return
