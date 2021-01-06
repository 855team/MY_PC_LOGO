import React from "react";
import "../CSS/HallTable.css"
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

class HallTable extends React.Component{
    state = {
        searchText: '',
        searchedColumn: '',
    };

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };


    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#ffeb37' : 'white' }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                console.log(visible)
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => text
    });

    render(){
        const columns=[
            {
                title: 'RoomId',
                dataIndex: 'rid',
                key: 'rid',
                sorter: {
                    compare: (a, b) => a.rid - b.rid,
                }
            },
            {
                title: '房主',
                dataIndex: 'username',
                key: 'username',
                ...this.getColumnSearchProps('username'),
            },
            {
                title:'房主Id',
                dataIndex: 'uid',
                key: 'uid'
            }
        ];

        return (
            <Table
                columns={columns}
                dataSource={this.props.dataSource}
                rowKey={record=>record.rid}
                pagination={false}
                scroll={{y: true}}
            />);
    }
}

export default HallTable;
