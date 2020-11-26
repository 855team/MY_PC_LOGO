import React, { Component } from 'react';
import * as monaco from 'monaco-editor';
import PropTypes, {func} from 'prop-types';
import highlight from '../Controller/logo_highlight';

var keywords = [
  'ST', 'HT',                         // 显示隐藏乌龟
  'FD', 'BK', 'LT', 'RT',             // 前后左右
  'CS', 'CLEAN',                      // 清屏复位, 清屏不复位
  'PU', 'PD',                         // 提笔落笔
  'SETXY', 'SETX', 'SETY',            // 坐标定位
  'SETPC', 'SETW', 'SETWIDTH',        // 设定笔颜色、粗细
  'SETBG', 'SETBGPATTERN',            // 设定背景颜色、花纹
  'STAMPOVAL', 'STAMPRECT',           // 画椭圆、矩形
  'FILL',                             // 填色
  'XCOR', 'YCOR',                     // 输出XY轴坐标
  'RANDOM',                           // 随机数
  'PRINT', 'PR',                      // 控制台输出
  'MAKE',                             // MAKE "变量名 表达式，用于赋值
  'REPEAT', 'RT',                     // 重复
  'SAVEPIC',                          // 保存文件
  'TO', 'END'                         // Procedure开始、结束
];

function noop() {}

const autocompletion = (range) => [{
  label: 'ST',
  kind: monaco.languages.CompletionItemKind.Keyword,
  insertText: 'ST\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: '显示海龟',
  range: range
}, {
  label: 'HT',
  kind: monaco.languages.CompletionItemKind.Keyword,
  insertText: 'HT\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: '隐藏海龟',
  range: range
}, {
  label: 'FD',
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: 'FD x\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: '海龟前进',
  range: range
}, {
  label: 'BK\n',
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: 'BK x\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: '海龟后退',
  range: range
}, {
  label: 'LT',
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: 'LT x\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: '海龟左转',
  range: range
}, {
  label: 'RT',
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: 'RT x\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: '海龟右转',
  range: range
}, {
  label: 'CS',
  kind: monaco.languages.CompletionItemKind.Keyword,
  insertText: 'CS\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: '清屏复位',
  range: range
}, {
  label: 'CLEAN',
  kind: monaco.languages.CompletionItemKind.Keyword,
  insertText: 'CLEAN\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: '清屏',
  range: range
}, {
  label: 'PU',
  kind: monaco.languages.CompletionItemKind.Keyword,
  insertText: 'PU\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: '提笔',
  range: range
}, {
  label: 'PD',
  kind: monaco.languages.CompletionItemKind.Keyword,
  insertText: 'PD\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: '落笔',
  range: range
}, {
  label: 'SETXY',
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: 'SETXY [x y]\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: 'XY坐标定位',
  range: range
}, {
  label: 'SETX',
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: 'SETX x\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: 'X坐标定位',
  range: range
}, {
  label: 'SETY',
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: 'SETY x\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: 'Y坐标定位',
  range: range
}, {
  label: 'REPEAT',
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: 'REPEAT n [\n\t\n]\n',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: '重复代码段',
  range: range
}];

export default class MonacoEditor extends Component {
  constructor(props) {
    super(props);
    this.containerElement = undefined;
    this._currentValue = props.value;

    monaco.languages.register({id: 'LOGO'});
    monaco.languages.setMonarchTokensProvider('LOGO', highlight);
    monaco.languages.registerCompletionItemProvider('LOGO', {
          provideCompletionItems: (model, position) => {
            console.log(model.getWordUntilPosition(position));
            let word = model.getWordUntilPosition(position);
            let range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn
            };
            return { suggestions: autocompletion(range) };
          }
    });

  }
  componentDidMount() {
    this.initMonacoEditor();
  }
  componentDidUpdate(prevProps) {
    if (this.props.value !== this._currentValue) {
      this._currentValue = this.props.value;
      if (this.editor) {
        this.editor.setValue(this._currentValue);
      }
    }
    if (prevProps.language !== this.props.language) {
      monaco.editor.setModelLanguage(this.editor.getModel(), this.props.language);
    }
    if (prevProps.theme !== this.props.theme) {
      monaco.editor.setTheme(this.props.theme);
    }
    if (
      this.editor &&
      (this.props.width !== prevProps.width || this.props.height !== prevProps.height)
    ) {
      this.editor.layout();
    }
  }
  editorDidMount(editor) {
    this.props.editorDidMount(editor, monaco);
    editor.onDidChangeModelContent((event) => {
      const value = editor.getValue();
      this.props.updatecontent(value);
      // Always refer to the latest value
      this._currentValue = value;
      this.props.onChange(value, event);
    });
  }
  initMonacoEditor() {
    const value = this.props.value !== null ? this.props.value : this.props.defaultValue;
    const { language, theme, options } = this.props;
    if (this.containerElement) {
      this.editor = monaco.editor.create(this.containerElement, {
        value,
        language,
        ...options,
      });
      if (theme) {
        monaco.editor.setTheme(theme);
      }
      // After initializing monaco editor
      this.editorDidMount(this.editor);
    }
    this.editor.addAction({       //custom context-menu
      id: "Save",
      label: "Save",
      contextMenuOrder: 0, // choose the order
      contextMenuGroupId: "operation",
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
      ],
      run: ()=>this.props.save(),
    })
    this.editor.addAction({       //custom context-menu
      id: "New",
      label: "New",
      contextMenuOrder: 0, // choose the order
      contextMenuGroupId: "operation",
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_N,
      ],
      run: ()=>this.props.new(),
    })
  }
  editorRef = (component) => {
    this.containerElement = component;
  };
  render() {
    const { width, height, className } = this.props;
    return(
          <div className={className} ref={this.editorRef} style={{ width, height }} />
    )
  }
}

MonacoEditor.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  language: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.object,
  editorDidMount: PropTypes.func,
  onChange: PropTypes.func,
};

MonacoEditor.defaultProps = {
  width: '100%',
  height: '100%',
  value: null,
  defaultValue: '',
  language: 'javascript',
  theme: null,
  options: {},
  editorDidMount: noop,
  onChange: noop,
};
