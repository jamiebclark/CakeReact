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
		return $this->Html->script([(Environment::is('development') ? 'babel/dev/' : 'babel/min/') . $path]);
	}
}