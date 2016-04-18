package com.arvato.acrm.model;

import com.arvato.acrm.commons.util.Tools;

/**
 * 设计器节点/线段位置类
 */
public class Position {
	private int left = 0;		// 左边距
	private int top = 0;		// 上边距
	private int x = 80;			// x轴偏移量
	private int y = 80;			// y轴偏移量
	private int width = 1000;	// 画布宽度
	private int height = 1000;	// 画布高度

	/**
	 * 根据pos获取left,若pos不存在,自动计算出下一个left
	 * @return
	 */
	public int getLeft(String pos) {
		if(!Tools.isBlank(pos)){
			String[] array = pos.split(",");
			if (array.length == 2) {
				left = Integer.parseInt(array[0]);
				top = Integer.parseInt(array[1]);
				return left;
			}
		}
		return getLeft();
	}
	
	public int getLeft() {
		// 节点距离左侧最小距离
		if (left == 0 || left > width) {
			left = 10;
			return left;
		}
		
		if ((left + x) > width||(left + x) < 10) {

			// 到达边界(左侧,右侧),将top下移,偏移量反转(往回调)
			top += y;
			x *= -1;
		} else {
			
			// 新位置为left+x
			left += x;
		}
		return left;
	}
	
	/**
	 * 获取top
	 * @return
	 */
	public int getTop() {
		if (top + y > height) {
			top -= y;
		}
		return top;
	}
}
