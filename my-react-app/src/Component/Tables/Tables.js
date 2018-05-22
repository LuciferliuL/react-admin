import React, { Component } from 'react';
import { Table } from 'antd'


/**
 * @param {接受参数} Data
 * @param {接受columns} Columns
 * @param {接受选择条目的信息} TableEmitData
 */
class Tables extends Component {
    state = {
        selectedRowKeys: []
    }
    onSelectChange = (selectedRowKeys,selectedRowValue) => {
        console.log('selectedRowKeys changed: ', selectedRowValue);
        this.props.TableEmitData(selectedRowValue[0])
    }
    render() {
        const {selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type:'radio'
        };
        const { Data, columns } = this.props
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={Data}
                    rowKey='PK'
                    rowSelection={rowSelection}
                    bordered
                ></Table>
            </div>
        );
    }
}

export default Tables;