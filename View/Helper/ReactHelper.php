<?php
class ReactHelper extends AppHelper {
	public $helpers = ['Html'];

	public function element($babelPath, $attrs = [], $data = []) {
		if (is_string($attrs)) {
			$attrs = ['id' => $attrs];
		}

		$data['base'] = Router::url('/', true);
		foreach ($data as $k => $v) {
			$attrs['data-' . $k] = $v;
		}
		$out = $this->Html->div(null, '', $attrs);
		$out .= $this->babel($babelPath);
		return $out;
	}

	public function babel($path) {
		$info = pathinfo($path);
		if (empty($info['extension'])) {
			$path .= '.js';
		}
		//$path = (Environment::is('development') ? 'babel/dev/' : 'babel/min/') . $path;
		$path = 'babel/prod/' . $path;
		$file = APP . DS . 'webroot' . DS . 'js' . DS . $path;
		$path .= '?t=' . filemtime($file);
		return $this->Html->script([$path]);
	}
}